import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { createLedgerSchema, ledgerUpdateFields } from "@/lib/ledgers/schema";
import * as ledgers from "@/server/data/ledgers";

import { defineTool } from "../define-tool";
import { LEDGERS_READ, LEDGERS_WRITE } from "../scopes";

const idSchema = z.object({ id: z.string().min(1) });
const updateSchema = z.object({ id: z.string().min(1), ...ledgerUpdateFields });

const listLedgersTool = defineTool({
  name: "list_ledgers",
  title: "List ledgers",
  description: "List all budget ledgers for the authenticated user.",
  inputSchema: z.object({}),
  scopes: [LEDGERS_READ],
  handler: (ctx) => ledgers.listLedgers(ctx.uid),
});

const getLedgerTool = defineTool({
  name: "get_ledger",
  title: "Get ledger",
  description: "Get a single budget ledger by its id.",
  inputSchema: idSchema,
  scopes: [LEDGERS_READ],
  handler: (ctx, { id }) => ledgers.getLedger(ctx.uid, id),
});

const createLedgerTool = defineTool({
  name: "create_ledger",
  title: "Create ledger",
  description: "Create a new budget ledger with a name and optional cash cap.",
  inputSchema: createLedgerSchema,
  scopes: [LEDGERS_WRITE],
  handler: (ctx, input) => ledgers.createLedger(ctx.uid, input),
});

const updateLedgerTool = defineTool({
  name: "update_ledger",
  title: "Update ledger",
  description: "Update a budget ledger's name and/or cash cap.",
  inputSchema: updateSchema,
  scopes: [LEDGERS_WRITE],
  handler: async (ctx, { id, ...updates }) => {
    await ledgers.updateLedger(ctx.uid, id, updates);
    return ledgers.getLedger(ctx.uid, id);
  },
});

const deleteLedgerTool = defineTool({
  name: "delete_ledger",
  title: "Delete ledger",
  description:
    "Delete a budget ledger along with its transactions and savings goals.",
  inputSchema: idSchema,
  scopes: [LEDGERS_WRITE],
  handler: async (ctx, { id }) => {
    await ledgers.deleteLedger(ctx.uid, id);
    return { deleted: id };
  },
});

const ledgerTools = [
  createLedgerTool,
  deleteLedgerTool,
  getLedgerTool,
  listLedgersTool,
  updateLedgerTool,
];

export function registerLedgerTools(server: McpServer): void {
  for (const register of ledgerTools) {
    register(server);
  }
}
