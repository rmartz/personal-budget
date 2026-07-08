#!/usr/bin/env node
/**
 * Enforce that every external GitHub Action is pinned to a full commit SHA
 * (CLAUDE.md — CI / supply-chain hardening), the Actions analogue of
 * check-package-pins.mjs.
 *
 * A mutable tag (`actions/checkout@v7`) can be re-pointed at malicious code by a
 * compromised maintainer or token; a 40-char commit SHA is immutable. Every
 * `uses:` that references an external action must therefore:
 *   1. pin a 40-char commit SHA, and
 *   2. carry a trailing version comment (`@<sha> # v7.0.0`).
 * The comment is not cosmetic: Dependabot's github-actions updater reads it to
 * know the current version, and bumps the SHA and the comment together on a new
 * release. A SHA with no version comment is pinned but un-trackable, so it is a
 * violation too.
 *
 * Skipped: local composite actions (`./…`, `../…`) and `docker://` image refs —
 * neither is a mutable Git tag this rule governs.
 *
 * Exit 0 = compliant, 1 = violations found, 2 = usage error.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SHA = /^[0-9a-f]{40}$/;
const USES = /^\s*(?:-\s*)?uses:\s*["']?([^"'#\s]+)/;
// A version comment right after the ref (`# v7.0.0`, optional `v`, `# 7.0` ok):
// the token Dependabot reads to track the pin. Must lead the comment.
const VERSION_COMMENT = /#\s*v?\d+(?:\.\d+)*/;
const IN_CI = process.env.GITHUB_ACTIONS === "true";

function findWorkflowFiles(directory) {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...findWorkflowFiles(path));
    } else if (entry.name.endsWith(".yml") || entry.name.endsWith(".yaml")) {
      found.push(path);
    }
  }
  return found;
}

function violationsFor(file) {
  const found = [];
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    const match = USES.exec(line);
    if (!match) return;
    const ref = match[1];
    // Local composite actions and Docker image refs are not mutable Git tags.
    if (ref.startsWith("./") || ref.startsWith("../")) return;
    if (ref.startsWith("docker://")) return;

    const at = ref.lastIndexOf("@");
    const location = `${file}:${index + 1}`;
    if (at === -1) {
      found.push(
        `${location} — "${ref}" has no ref; pin a commit SHA (\`@<sha> # vX.Y.Z\`)`,
      );
    } else if (!SHA.test(ref.slice(at + 1))) {
      found.push(
        `${location} — "${ref}" is tag/branch-pinned; pin the commit SHA instead (\`@<sha> # vX.Y.Z\`)`,
      );
    } else if (!VERSION_COMMENT.test(line)) {
      found.push(
        `${location} — "${ref}" is SHA-pinned but has no version comment; add \`# vX.Y.Z\` so Dependabot can track and bump the pin`,
      );
    } else {
      found.push(null); // compliant external ref (counted below)
    }
  });
  return found;
}

const root = process.argv[2] ?? ".github";
const results = findWorkflowFiles(root).flatMap(violationsFor);
const violations = results.filter((entry) => entry !== null);
const checkedCount = results.length;

for (const violation of violations) {
  if (IN_CI) {
    console.log(`::error title=Unpinned GitHub Action::${violation}`);
  } else {
    console.error(`error: ${violation}`);
  }
}

if (violations.length > 0) {
  console.error(
    `\n${violations.length} unpinned GitHub Action(s). Pin each to a commit SHA — see CLAUDE.md (CI).`,
  );
  process.exit(1);
}

console.log(
  `All external GitHub Actions are SHA-pinned with version comments (${checkedCount} ref(s) checked).`,
);
