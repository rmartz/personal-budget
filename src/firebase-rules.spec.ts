import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const rulesPath = resolve(
  import.meta.dirname,
  "../firebase/database.rules.json",
);
const firebaseConfigPath = resolve(import.meta.dirname, "../firebase.json");

function readRulesJson(): Record<string, unknown> {
  const raw = readFileSync(rulesPath, "utf-8");
  // Strip JS-style line comments before parsing (Firebase CLI allows them)
  const stripped = raw.replace(/\/\/[^\n]*/g, "");
  return JSON.parse(stripped) as Record<string, unknown>;
}

function getRulesRoot(rules: Record<string, unknown>): Record<string, unknown> {
  return rules["rules"] as Record<string, unknown>;
}

function getUidNode(rules: Record<string, unknown>): Record<string, unknown> {
  const root = getRulesRoot(rules);
  const users = root["users"] as Record<string, unknown>;
  return users["$uid"] as Record<string, unknown>;
}

describe("firebase/database.rules.json — structure", () => {
  it("has a top-level rules object", () => {
    const rules = readRulesJson();
    expect(rules["rules"]).toBeDefined();
  });

  it("has a users.$uid path with read and write rules", () => {
    const rules = readRulesJson();
    const root = getRulesRoot(rules);
    const users = root["users"] as Record<string, unknown>;
    expect(users).toBeDefined();
    const uidNode = users["$uid"] as Record<string, unknown>;
    expect(uidNode).toBeDefined();
    expect(typeof uidNode[".read"]).toBe("string");
    expect(typeof uidNode[".write"]).toBe("string");
  });

  it("restricts read access to the authenticated owner of each uid path", () => {
    const rules = readRulesJson();
    const uidNode = getUidNode(rules);
    const readRule = uidNode[".read"] as string;
    expect(readRule).toContain("auth != null");
    expect(readRule).toContain("auth.uid === $uid");
  });

  it("restricts write access to the authenticated owner of each uid path", () => {
    const rules = readRulesJson();
    const uidNode = getUidNode(rules);
    const writeRule = uidNode[".write"] as string;
    expect(writeRule).toContain("auth != null");
    expect(writeRule).toContain("auth.uid === $uid");
  });

  it("denies all reads at the root level", () => {
    const rules = readRulesJson();
    const root = getRulesRoot(rules);
    expect(root[".read"]).toBe(false);
  });

  it("denies all writes at the root level", () => {
    const rules = readRulesJson();
    const root = getRulesRoot(rules);
    expect(root[".write"]).toBe(false);
  });
});

describe("firebase/database.rules.json — documentation", () => {
  it("contains inline comments explaining each section", () => {
    const raw = readFileSync(rulesPath, "utf-8");
    expect(raw).toContain("//");
  });

  it("has at least two comment lines", () => {
    const raw = readFileSync(rulesPath, "utf-8");
    const lines = raw.split("\n");
    const commentLines = lines.filter((l) => l.trimStart().startsWith("//"));
    expect(commentLines.length).toBeGreaterThanOrEqual(2);
  });
});

describe("firebase.json", () => {
  it("references firebase/database.rules.json as the database rules file", () => {
    const config = JSON.parse(
      readFileSync(firebaseConfigPath, "utf-8"),
    ) as Record<string, unknown>;
    const database = config["database"] as Record<string, unknown>;
    expect(database).toBeDefined();
    expect(database["rules"]).toBe("firebase/database.rules.json");
  });
});
