#!/usr/bin/env node
/**
 * Mint a Firebase ID token for a seeded staging test user, for driving the MCP
 * server's first-party (Bearer) path during UAT. Firebase ID tokens expire in
 * ~1 hour, so mint a fresh one per test session.
 *
 * Uses the Firebase Auth REST API (signInWithPassword) against the staging
 * project. The Web API key is public (it lives in deployment/staging.yml); the
 * password is the staging-only STAGING_TEST_PASSWORD shared by the seeded
 * accounts (see docs/staging-test-accounts.md). The token's `aud` is the staging
 * project, so it verifies against a server whose Admin SDK is the same project.
 *
 * Env:
 *   STAGING_TEST_PASSWORD  (required) shared password of the seeded test users
 *   MCP_TEST_EMAIL         (optional) default "active@staging.test"
 *   MCP_TEST_API_KEY       (optional) default: staging NEXT_PUBLIC_FIREBASE_API_KEY
 *
 * CLI: prints the raw ID token to stdout.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { parse } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));

export function stagingApiKey() {
  const path = join(here, "..", "deployment", "staging.yml");
  const config = parse(readFileSync(path, "utf8"));
  const key = config?.variables?.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_API_KEY not found in deployment/staging.yml",
    );
  }
  return key;
}

export async function mintTestToken({
  apiKey = process.env.MCP_TEST_API_KEY ?? stagingApiKey(),
  email = process.env.MCP_TEST_EMAIL ?? "active@staging.test",
  password = process.env.STAGING_TEST_PASSWORD,
} = {}) {
  if (!password) {
    throw new Error(
      "Set STAGING_TEST_PASSWORD (the seeded staging test users' shared password).",
    );
  }
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `signInWithPassword failed (${String(response.status)}): ${detail}`,
    );
  }
  const data = await response.json();
  if (!data.idToken) {
    throw new Error("signInWithPassword response did not include an idToken");
  }
  return data.idToken;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    process.stdout.write(`${await mintTestToken()}\n`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
