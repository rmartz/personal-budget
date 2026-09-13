import type { CallToolResult, McpServer } from "@modelcontextprotocol/server";
import type { z } from "zod";

import type { McpScope } from "./scopes";

/**
 * The context every tool receives — a `uid` derived once from the verified
 * identity by `withUser`. Tools never see the raw token or any other user's id,
 * so it is structurally impossible for a tool to touch another user's data.
 */
export interface ToolContext {
  uid: string;
}

export interface ToolDefinition<Shape extends z.ZodRawShape> {
  name: string;
  title: string;
  description: string;
  inputSchema: z.ZodObject<Shape>;
  scopes: readonly McpScope[];
  handler: (
    context: ToolContext,
    args: z.infer<z.ZodObject<Shape>>,
  ) => Promise<unknown>;
}

function textResult(text: string, isError = false): CallToolResult {
  return { content: [{ type: "text", text }], isError };
}

/**
 * Registers a tool on the MCP server, wrapping its handler with `withUser`:
 * the uid is read from the verified auth info and passed as the tool context.
 * The result is serialized as JSON text content.
 */
export function defineTool<Shape extends z.ZodRawShape>(
  def: ToolDefinition<Shape>,
): (server: McpServer) => void {
  return (server) => {
    server.registerTool(
      def.name,
      {
        title: def.title,
        description: def.description,
        inputSchema: def.inputSchema,
      },
      async (args, ctx) => {
        const uid = ctx.http?.authInfo?.extra?.["uid"];
        if (typeof uid !== "string") {
          return textResult(
            "Unauthenticated: no user identity on request",
            true,
          );
        }
        const data = await def.handler({ uid }, args);
        return textResult(JSON.stringify(data ?? null, null, 2));
      },
    );
  };
}
