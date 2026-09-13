import { NextResponse } from "next/server";

import { updateLedgerSchema } from "@/lib/ledgers/schema";
import { deleteLedger, getLedger, updateLedger } from "@/server/data/ledgers";
import { withIdentity } from "@/server/http/with-identity";

interface LedgerRouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withIdentity<LedgerRouteContext>(
  async (uid, _request, { params }) => {
    const { id } = await params;
    const ledger = await getLedger(uid, id);
    if (!ledger) {
      return NextResponse.json({ error: "Ledger not found" }, { status: 404 });
    }
    return NextResponse.json({ ledger });
  },
);

export const PATCH = withIdentity<LedgerRouteContext>(
  async (uid, request, { params }) => {
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = updateLedgerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    if (!(await getLedger(uid, id))) {
      return NextResponse.json({ error: "Ledger not found" }, { status: 404 });
    }

    await updateLedger(uid, id, parsed.data);
    const ledger = await getLedger(uid, id);
    return NextResponse.json({ ledger });
  },
);

export const DELETE = withIdentity<LedgerRouteContext>(
  async (uid, _request, { params }) => {
    const { id } = await params;
    await deleteLedger(uid, id);
    return new NextResponse(null, { status: 204 });
  },
);
