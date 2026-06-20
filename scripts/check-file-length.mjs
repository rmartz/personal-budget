#!/usr/bin/env node
/**
 * Enforce file LOC caps on TypeScript source files.
 *
 * Thresholds (CLAUDE.md — 2× the recommended max):
 *   Source files (.ts/.tsx):      recommended ~200 lines, hard cap 400
 *   Test files (*.spec.ts, etc.): recommended ~300 lines, hard cap 600
 *
 * Modes:
 *   --staged       staged index vs HEAD  (pre-commit hook)
 *   --base <ref>   changed files vs ref  (CI; ref is the PR merge-base so an
 *                  advancing base branch never skews the comparison)
 *
 * The same limits lived inline in .github/workflows/file-length.yml; both CI
 * and .husky/pre-commit call this script so the rule cannot drift between
 * commit time and CI.
 *
 * Bypass: `git commit --no-verify` skips the pre-commit hook (git-native).
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parseArgs } from "node:util";

const SOURCE_LIMIT = 400;
const TEST_LIMIT = 600;

const IN_CI = process.env.GITHUB_ACTIONS === "true";

function isTestFile(path) {
  return (
    path.endsWith(".spec.ts") ||
    path.endsWith(".spec.tsx") ||
    path.endsWith(".test.ts") ||
    path.endsWith(".test.tsx") ||
    path.includes("-tests/")
  );
}

function limitFor(path) {
  return isTestFile(path)
    ? { limit: TEST_LIMIT, kind: "test" }
    : { limit: SOURCE_LIMIT, kind: "source" };
}

function git(args) {
  return execSync(`git ${args}`, { encoding: "utf8" });
}

function stagedLineCount(path) {
  try {
    return git(`show ":${path}"`).split("\n").length - 1;
  } catch {
    return null;
  }
}

function changedFiles(base, staged) {
  const output = staged
    ? git("diff --cached --name-only --diff-filter=ACMR")
    : git(`diff --name-only "${base}" HEAD`);
  return output
    .trim()
    .split("\n")
    .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
}

function lineCount(path, base, staged) {
  if (staged) return stagedLineCount(path);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").split("\n").length - 1;
}

const { values } = parseArgs({
  options: {
    staged: { type: "boolean", default: false },
    base: { type: "string" },
  },
});

if (!values.staged && !values.base) {
  console.error("error: --staged or --base <ref> required");
  process.exit(2);
}

const files = changedFiles(values.base, values.staged);
let failed = false;

for (const file of files) {
  const lines = lineCount(file, values.base, values.staged);
  if (lines === null) continue;

  const { limit, kind } = limitFor(file);
  if (lines < limit) continue;

  if (IN_CI) {
    console.log(
      `::error file=${file},title=File too long::${file} — ${lines} lines (${kind} limit: ${limit})`,
    );
  } else {
    console.error(`error: ${file} — ${lines} lines (${kind} limit: ${limit})`);
  }
  failed = true;
}

if (failed) {
  console.error(`
One or more files exceed the maximum allowed line count.
  Source files: recommended max ~200 lines, split at ~240, hard cap ${SOURCE_LIMIT}+
  Test files:   recommended max ~300 lines, split at ~360, hard cap ${TEST_LIMIT}+
Split large files by logical concern before committing.`);
  process.exit(1);
}
