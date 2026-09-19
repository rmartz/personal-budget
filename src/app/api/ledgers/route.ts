import { NextResponse } from "next/server";

import { createLedgerSchema } from "@/lib/ledgers/schema";
import { createLedger, listLedgers } from "@/server/data/ledgers";
import { withIdentity } from "@/server/http/with-identity";

export const GET = withIdentity(async (uid) => {
  const ledgers = await listLedgers(uid);
  return NextResponse.json({ ledgers });
});

export const POST = withIdentity(async (uid, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createLedgerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const ledger = await createLedger(uid, parsed.data);
  return NextResponse.json({ ledger }, { status: 201 });
});
