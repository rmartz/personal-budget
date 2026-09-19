#!/usr/bin/env node
/**
 * Mint a Firebase ID token for a seeded staging test user, for driving the MCP
 * server's first-party (Bearer) path during UAT. Uses the Firebase Admin SDK
 * (the staging service account already materialized into .env.local by
 * `envctl config pull --env staging`) to create a custom token and exchange it
 * for an ID token — so no test-user password is involved. ID tokens expire in
 * ~1 hour, so mint fresh per session.
 *
 * Env (all provided by `envctl config pull --env staging` into .env.local):
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY  (admin SDK)
 *   MCP_TEST_EMAIL    (optional) default "active@staging.test"
 *   MCP_TEST_API_KEY  (optional) default: staging NEXT_PUBLIC_FIREBASE_API_KEY
 *
 * CLI: prints the raw ID token to stdout.
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
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

function adminAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Admin credentials missing (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / " +
        "FIREBASE_PRIVATE_KEY). Run `envctl config pull --env staging` first.",
    );
  }
  const app =
    getApps().find((a) => a.name === "mint-test-token") ??
    initializeApp(
      { credential: cert({ projectId, clientEmail, privateKey }) },
      "mint-test-token",
    );
  return getAuth(app);
}

export async function mintTestToken({
  apiKey = process.env.MCP_TEST_API_KEY ?? stagingApiKey(),
  email = process.env.MCP_TEST_EMAIL ?? "active@staging.test",
} = {}) {
  const auth = adminAuth();
  const { uid } = await auth.getUserByEmail(email);
  const customToken = await auth.createCustomToken(uid);

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: customToken, returnSecureToken: true }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `signInWithCustomToken failed (${String(response.status)}): ${detail}`,
    );
  }
  const data = await response.json();
  if (!data.idToken) {
    throw new Error(
      "signInWithCustomToken response did not include an idToken",
    );
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
