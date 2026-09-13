import { createMcpHandler, withMcpAuth } from "mcp-handler";

import { verifyToken } from "@/server/mcp/auth";
import { registerLedgerTools } from "@/server/mcp/tools/ledgers";

const handler = createMcpHandler(
  (server) => {
    registerLedgerTools(server);
  },
  {
    serverInfo: { name: "personal-budget", version: "1.0.0" },
  },
);

const authHandler = withMcpAuth(handler, verifyToken, { required: true });

export { authHandler as DELETE, authHandler as GET, authHandler as POST };
