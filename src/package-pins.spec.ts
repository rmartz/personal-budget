import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

// Every package.json version specifier must pin a full major.minor.patch, even
// when using a range annotation (`^1.2.3`, not `^1`). Dependabot preserves the
// existing constraint style when it bumps a package, so a full pin records each
// update as a package.json diff rather than burying a minor/patch bump in the
// lockfile alone — keeping dependency changes explicit and reviewable. A short
// pin like `^3` would absorb a minor bump invisibly (e.g. a Prettier release
// that silently alters formatting). See AGENTS.md → Dependencies.
const FULL_SEMVER = /^[\^~]?\d+\.\d+\.\d+/;

// Prettier and its plugins are held to the stricter exact pin (no range
// annotation at all). A caret/tilde would let a lockfile regeneration resolve a
// newer Prettier whose formatting differs, producing spurious whole-file
// reformat diffs in unrelated PRs.
const EXACT_PINNED_PACKAGES = ["prettier", "prettier-plugin-tailwindcss"];
const EXACT_SEMVER = /^\d+\.\d+\.\d+$/;

const packageJsonPath = resolve(import.meta.dirname, "../package.json");

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function readPackageJson(): PackageJson {
  return JSON.parse(readFileSync(packageJsonPath, "utf-8")) as PackageJson;
}

const { dependencies, devDependencies } = readPackageJson();
const allDependencies = Object.entries({ ...dependencies, ...devDependencies });

describe("package.json — full-version pinning", () => {
  it.each(allDependencies)(
    "pins %s to a full major.minor.patch version",
    (_pkg, version) => {
      expect(version).toMatch(FULL_SEMVER);
    },
  );
});

describe("package.json — Prettier exact pinning", () => {
  it.each(EXACT_PINNED_PACKAGES)(
    "pins %s to an exact version (no ^ or ~ range)",
    (pkg) => {
      const version = devDependencies[pkg];
      expect(version).toBeDefined();
      expect(version).toMatch(EXACT_SEMVER);
    },
  );
});
