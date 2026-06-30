#!/usr/bin/env node
/**
 * Enforce package.json version-pin policy (CLAUDE.md — Dependencies).
 *
 * Two rules, checked across every package.json in the repo (root + any nested
 * manifests, excluding node_modules):
 *
 *   1. Full base — every external dependency's version range must have a full
 *      `major.minor.patch` base, keeping any `^`/`~` operator. `"^3.8.3"` is
 *      fine; `"^3"` / `"^3.8"` / `"*"` / `"latest"` are not. This keeps every
 *      Dependabot bump visible as a package.json diff instead of a lockfile-only
 *      change (Dependabot preserves the existing constraint style).
 *   2. Exact Prettier — `prettier` and any `prettier-plugin-*` must pin an exact
 *      version with no `^`/`~`, so a lockfile regeneration can never resolve a
 *      newer Prettier whose formatting differs and reformat the tree.
 *
 * Non-registry specifiers (workspace:, catalog:, link:, file:, npm:, git/URL,
 * github: shorthand) are skipped — they carry no semver range to validate.
 *
 * Exit 0 = compliant, 1 = violations found, 2 = usage error.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DEPENDENCY_BLOCKS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];
const SKIP_DIRECTORIES = new Set([
  ".git",
  ".git-worktrees",
  "node_modules",
  ".next",
  "storybook-static",
]);

const FULL_BASE = /^[\^~]?\d+\.\d+\.\d+([-+].+)?$/;
const EXACT_BASE = /^\d+\.\d+\.\d+([-+].+)?$/;
const NON_REGISTRY_PREFIXES = [
  "workspace:",
  "catalog:",
  "link:",
  "file:",
  "npm:",
  "git+",
  "git:",
  "github:",
  "http:",
  "https:",
];

const IN_CI = process.env.GITHUB_ACTIONS === "true";

function findPackageJsonFiles(directory) {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name) || entry.name.startsWith(".")) {
        continue;
      }
      found.push(...findPackageJsonFiles(join(directory, entry.name)));
    } else if (entry.name === "package.json") {
      found.push(join(directory, entry.name));
    }
  }
  return found;
}

function isNonRegistry(range) {
  return (
    range.includes("/") ||
    NON_REGISTRY_PREFIXES.some((prefix) => range.startsWith(prefix))
  );
}

function isPrettierPackage(name) {
  return name === "prettier" || name.startsWith("prettier-plugin-");
}

function violationsFor(file) {
  const manifest = JSON.parse(readFileSync(file, "utf8"));
  const found = [];
  for (const block of DEPENDENCY_BLOCKS) {
    for (const [name, range] of Object.entries(manifest[block] ?? {})) {
      if (isNonRegistry(range)) continue;
      if (!FULL_BASE.test(range)) {
        found.push(
          `${file} — ${block}.${name} "${range}" must pin a full major.minor.patch base (e.g. "^1.2.3")`,
        );
      } else if (isPrettierPackage(name) && !EXACT_BASE.test(range)) {
        found.push(
          `${file} — ${block}.${name} "${range}" must pin an exact version with no ^ or ~ range`,
        );
      }
    }
  }
  return found;
}

const root = process.argv[2] ?? ".";
const files = findPackageJsonFiles(root);
const violations = files.flatMap(violationsFor);

for (const violation of violations) {
  if (IN_CI) {
    console.log(`::error title=Invalid package.json pin::${violation}`);
  } else {
    console.error(`error: ${violation}`);
  }
}

if (violations.length > 0) {
  console.error(
    `\n${violations.length} package.json pin violation(s). See CLAUDE.md — Dependencies.`,
  );
  process.exit(1);
}

console.log(
  `All package.json pins are compliant (${files.length} manifest(s) checked).`,
);
