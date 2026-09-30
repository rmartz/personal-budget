import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { ledgerIdSchema } from "@/lib/ledgers/schema";
import * as savingsGoals from "@/server/data/savings-goals";

import { defineTool } from "../define-tool";
import { GOALS_READ } from "../scopes";

const listSchema = z.object({ ledgerId: ledgerIdSchema });
const getSchema = z.object({ ledgerId: ledgerIdSchema, id: ledgerIdSchema });

const listSavingsGoalsTool = defineTool({
  name: "list_savings_goals",
  title: "List savings goals",
  description: "List all savings goals for a budget ledger.",
  inputSchema: listSchema,
  scopes: [GOALS_READ],
  handler: (ctx, { ledgerId }) =>
    savingsGoals.listSavingsGoals(ctx.uid, ledgerId),
});

const getSavingsGoalTool = defineTool({
  name: "get_savings_goal",
  title: "Get savings goal",
  description: "Get a single savings goal from a budget ledger by its id.",
  inputSchema: getSchema,
  scopes: [GOALS_READ],
  handler: (ctx, { ledgerId, id }) =>
    savingsGoals.getSavingsGoal(ctx.uid, ledgerId, id),
});

const savingsGoalTools = [getSavingsGoalTool, listSavingsGoalsTool];

export function registerSavingsGoalTools(server: McpServer): void {
  for (const register of savingsGoalTools) {
    register(server);
  }
}
