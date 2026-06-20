import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

// Prettier must stay pinned to an exact version. A caret/tilde range lets a
// lockfile regeneration resolve a newer Prettier whose formatting differs,
// producing spurious whole-file reformat diffs in unrelated PRs. Dependabot
// preserves the existing constraint style, so an exact pin is self-sustaining
// across bumps — this test guards against a human or tool (e.g. shadcn
// regeneration) silently loosening it back to a range.
const PINNED_PACKAGES = ["prettier", "prettier-plugin-tailwindcss"];

const packageJsonPath = resolve(import.meta.dirname, "../package.json");

function readDevDependencies(): Record<string, string> {
  const raw = readFileSync(packageJsonPath, "utf-8");
  return JSON.parse(raw).devDependencies as Record<string, string>;
}

describe("package.json — Prettier version pinning", () => {
  const devDependencies = readDevDependencies();

  it.each(PINNED_PACKAGES)(
    "pins %s to an exact version (no ^ or ~ range)",
    (pkg) => {
      const version = devDependencies[pkg];
      expect(version).toBeDefined();
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    },
  );
});
