import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { ledgerIdSchema } from "@/lib/ledgers/schema";
import * as transactions from "@/server/data/transactions";

import { defineTool } from "../define-tool";
import { TRANSACTIONS_READ } from "../scopes";

const listSchema = z.object({ ledgerId: ledgerIdSchema });
const getSchema = z.object({ ledgerId: ledgerIdSchema, id: ledgerIdSchema });

const listTransactionsTool = defineTool({
  name: "list_transactions",
  title: "List transactions",
  description: "List all transactions for a budget ledger.",
  inputSchema: listSchema,
  scopes: [TRANSACTIONS_READ],
  handler: (ctx, { ledgerId }) =>
    transactions.listTransactions(ctx.uid, ledgerId),
});

const getTransactionTool = defineTool({
  name: "get_transaction",
  title: "Get transaction",
  description: "Get a single transaction from a budget ledger by its id.",
  inputSchema: getSchema,
  scopes: [TRANSACTIONS_READ],
  handler: (ctx, { ledgerId, id }) =>
    transactions.getTransaction(ctx.uid, ledgerId, id),
});

const transactionTools = [getTransactionTool, listTransactionsTool];

export function registerTransactionTools(server: McpServer): void {
  for (const register of transactionTools) {
    register(server);
  }
}
