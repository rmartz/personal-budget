import { FirebaseAuthError } from "firebase-admin/auth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";
import { getAdminAuth } from "@/lib/firebase/admin";

const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

const TOKEN_REJECTION_CODES = new Set([
  "auth/id-token-expired",
  "auth/id-token-revoked",
  "auth/invalid-id-token",
]);

interface SessionRequestBody {
  idToken?: unknown;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SessionRequestBody;
  const { idToken } = body;

  if (typeof idToken !== "string" || idToken.length === 0) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  let sessionCookie: string;
  try {
    sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    });
  } catch (error) {
    // A rejected token (malformed, expired, revoked) is the caller's fault.
    // FirebaseAuthError also covers server-side failures such as
    // insufficient-permission or project-not-found, and those — like a missing
    // or invalid admin credential — must keep surfacing as a 500.
    if (
      error instanceof FirebaseAuthError &&
      TOKEN_REJECTION_CODES.has(error.code)
    ) {
      return NextResponse.json({ error: "Invalid idToken" }, { status: 401 });
    }
    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_EXPIRY_MS / 1000,
    path: "/",
  });

  return NextResponse.json({ status: "ok" });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return NextResponse.json({ status: "ok" });
}
