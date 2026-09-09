#!/usr/bin/env node
/**
 * Enforces this repo's `docs/` conventions (see the Documentation section of
 * AGENTS.md), following the Open Knowledge Format (OKF):
 *
 *   1. OKF frontmatter — every non-reserved `.md` file begins with a parseable
 *      YAML frontmatter block containing a non-empty `type` field. The reserved
 *      files `index.md` and `log.md` carry no frontmatter and are exempt.
 *   2. Index reachability — every directory that (transitively) holds a concept
 *      file has an `index.md`; every concept file is linked from its own
 *      directory's `index.md`; and every relevant subdirectory's `index.md` is
 *      linked from its parent's `index.md`. So a reader can always navigate
 *      `docs/index.md → sub/index.md → sub/feature.md`.
 *
 * Exits 0 when `docs/` is compliant (or absent), 1 when any violation is found.
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = join(root, "docs");

// Reserved OKF filenames: navigation / append-only log, never concept files.
const RESERVED = new Set(["index.md", "log.md"]);
const INDEX = "index.md";

const isMarkdown = (name) => name.endsWith(".md");
const isConcept = (name) => isMarkdown(name) && !RESERVED.has(name);

/**
 * Error string if `filePath` lacks a parseable YAML frontmatter block with a
 * non-empty `type` field, else undefined.
 */
function frontmatterError(filePath) {
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  if (lines[0].trim() !== "---") {
    return "missing OKF frontmatter (file must start with a `---` YAML block)";
  }
  const close = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (close === -1) {
    return "OKF frontmatter block is not closed with `---`";
  }
  const typeLine = lines.slice(1, close).find((line) => /^type:/.test(line));
  if (!typeLine) {
    return "OKF frontmatter is missing a `type` field";
  }
  const value = typeLine
    .replace(/^type:\s*/, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
  return value.length > 0 ? undefined : "OKF frontmatter `type` field is empty";
}

/**
 * The set of local files an `index.md` links to, resolved to absolute paths. A
 * link to a directory also counts as a link to that directory's `index.md`.
 */
function linkedTargets(indexPath) {
  const dir = dirname(indexPath);
  const content = readFileSync(indexPath, "utf8");
  const targets = new Set();
  for (const match of content.matchAll(/\]\(\s*<?([^)>\s]+)/g)) {
    const raw = match[1].split("#")[0].split("?")[0];
    if (raw.length === 0 || /^[a-z]+:/i.test(raw)) continue; // skip anchors / URLs
    const abs = resolve(dir, raw);
    targets.add(abs);
    try {
      if (statSync(abs).isDirectory()) targets.add(join(abs, INDEX));
    } catch {
      // Broken link target; the reachability assertions below still apply.
    }
  }
  return targets;
}

/** Recursively walk `dir`; returns whether it transitively holds a concept file. */
function walk(dir, violations) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const conceptFiles = entries
    .filter((e) => e.isFile() && isConcept(e.name))
    .map((e) => e.name);
  const subdirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);

  const relevantSubdirs = subdirs.filter((name) =>
    walk(join(dir, name), violations),
  );
  const isRelevant = conceptFiles.length > 0 || relevantSubdirs.length > 0;
  if (!isRelevant) return false;

  const rel = relative(root, dir) || ".";
  const hasIndex = entries.some((e) => e.isFile() && e.name === INDEX);
  if (!hasIndex) {
    violations.push(`${rel}: directory holds docs but has no index.md`);
    return true;
  }

  const linked = linkedTargets(join(dir, INDEX));
  for (const name of conceptFiles) {
    if (!linked.has(join(dir, name))) {
      violations.push(
        `${join(rel, name)}: not linked from ${join(rel, INDEX)}`,
      );
    }
  }
  for (const name of relevantSubdirs) {
    if (!linked.has(join(dir, name, INDEX))) {
      violations.push(
        `${join(rel, name, INDEX)}: not linked from parent ${join(rel, INDEX)}`,
      );
    }
  }
  return true;
}

function main() {
  let docsPresent;
  try {
    docsPresent = statSync(docsDir).isDirectory();
  } catch {
    docsPresent = false;
  }
  if (!docsPresent) {
    console.log("No docs/ directory — nothing to validate.");
    return;
  }

  const violations = [];

  // Frontmatter: every non-reserved .md under docs/, at any depth.
  const stack = [docsDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        stack.push(join(dir, entry.name));
      } else if (entry.isFile() && isConcept(entry.name)) {
        const filePath = join(dir, entry.name);
        const error = frontmatterError(filePath);
        if (error) violations.push(`${relative(root, filePath)}: ${error}`);
      }
    }
  }

  // Index reachability.
  walk(docsDir, violations);

  if (violations.length > 0) {
    console.error("docs/ convention violations:\n");
    for (const violation of violations.sort())
      console.error(`  ✗ ${violation}`);
    console.error(
      `\n${violations.length} violation(s). Every non-reserved docs .md needs OKF` +
        ` frontmatter with a \`type\`, and must be reachable via index.md links.`,
    );
    process.exit(1);
  }

  console.log("All docs/ files are OKF-compliant and index-reachable.");
}

main();
