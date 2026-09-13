#!/usr/bin/env node
/**
 * Drive the MCP server's first-party (Bearer) path from the command line — for
 * a Claude Code session (or a human) to exercise the tools during UAT without a
 * GUI client. Speaks MCP Streamable HTTP directly (initialize → initialized →
 * operation) over fetch, so it needs no MCP client dependency.
 *
 * Auth: mints a fresh staging ID token via mint-test-token.mjs unless --token is
 * given (see docs/mcp-server-testing.md for env vars).
 *
 * Usage:
 *   node scripts/mcp-smoke.mjs [--url URL] [--token TOKEN]            # list tools
 *   node scripts/mcp-smoke.mjs [--url URL] call <tool> [jsonArgs]     # call a tool
 *
 * Examples:
 *   node scripts/mcp-smoke.mjs                       # tools/list against localhost
 *   node scripts/mcp-smoke.mjs call list_ledgers
 *   node scripts/mcp-smoke.mjs call create_ledger '{"name":"Test","cashCap":500}'
 *   node scripts/mcp-smoke.mjs --url https://<preview>.vercel.app/api/mcp call list_ledgers
 */

import { mintTestToken } from "./mint-test-token.mjs";

const DEFAULT_URL = "http://localhost:3000/api/mcp";
const PROTOCOL_VERSION = "2025-06-18";

function parseArgs(argv) {
  const args = { url: DEFAULT_URL, token: undefined, command: "list" };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url") {
      args.url = argv[++i];
    } else if (argv[i] === "--token") {
      args.token = argv[++i];
    } else {
      rest.push(argv[i]);
    }
  }
  if (rest[0] === "call") {
    args.command = "call";
    args.toolName = rest[1];
    args.toolArgs = rest[2] ? JSON.parse(rest[2]) : {};
  }
  return args;
}

function parseSse(text) {
  const messages = [];
  for (const frame of text.split("\n\n")) {
    const data = frame
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");
    if (!data) {
      continue;
    }
    try {
      messages.push(JSON.parse(data));
    } catch {
      // Non-JSON SSE comment/keepalive — ignore.
    }
  }
  return messages;
}

async function rpc(url, bearer, ctx, message) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    Authorization: `Bearer ${bearer}`,
  };
  if (ctx.sessionId) {
    headers["Mcp-Session-Id"] = ctx.sessionId;
  }
  if (ctx.protocolVersion) {
    headers["MCP-Protocol-Version"] = ctx.protocolVersion;
  }
  // Get past Vercel Deployment Protection on a preview, when configured.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers["x-vercel-protection-bypass"] =
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", ...message }),
  });

  ctx.sessionId = response.headers.get("mcp-session-id") ?? ctx.sessionId;

  if (response.status === 401) {
    throw new Error(
      `401 Unauthorized — token expired/invalid, or the server's admin creds ` +
        `don't match the token's Firebase project. ${await response.text()}`,
    );
  }

  const body = await response.text();
  if (!body) {
    return undefined;
  }
  const contentType = response.headers.get("content-type") ?? "";
  const messages = contentType.includes("text/event-stream")
    ? parseSse(body)
    : [JSON.parse(body)];

  const match =
    messages.find((m) => message.id !== undefined && m.id === message.id) ??
    messages.find((m) => "result" in m || "error" in m) ??
    messages[0];

  if (match?.error) {
    throw new Error(
      `RPC error (${String(match.error.code)}): ${match.error.message}`,
    );
  }
  return match?.result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "call" && !args.toolName) {
    throw new Error("Usage: mcp-smoke.mjs call <tool> [jsonArgs]");
  }
  const bearer = args.token ?? (await mintTestToken());
  const ctx = { sessionId: undefined, protocolVersion: undefined };

  const init = await rpc(args.url, bearer, ctx, {
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "mcp-smoke", version: "1.0.0" },
    },
  });
  ctx.protocolVersion = init?.protocolVersion ?? PROTOCOL_VERSION;

  await rpc(args.url, bearer, ctx, { method: "notifications/initialized" });

  const result =
    args.command === "call"
      ? await rpc(args.url, bearer, ctx, {
          id: 2,
          method: "tools/call",
          params: { name: args.toolName, arguments: args.toolArgs },
        })
      : await rpc(args.url, bearer, ctx, {
          id: 2,
          method: "tools/list",
          params: {},
        });

  process.stdout.write(`${JSON.stringify(result, undefined, 2)}\n`);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
