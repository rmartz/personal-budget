import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

// `no-restricted-syntax` selectors that statically enforce prose conventions
// from CLAUDE.md. ESLint does not merge this rule's array across config
// objects — the last matching config wins — so the test-file block below must
// re-include these general selectors alongside its test-only additions.
const noRestrictedSyntax = [
  {
    // "No function-style imports": inline `import("…").Type` in type position.
    // (Dynamic `await import("…")` for a value is untouched — it is not a
    // TSImportType node.)
    selector: "TSImportType",
    message:
      'No inline import("…").Type. Use a module-level `import type { … } from "…"` statement.',
  },
  {
    // "No IIFEs": a function/arrow expression invoked in place.
    selector:
      "CallExpression[callee.type='FunctionExpression'], CallExpression[callee.type='ArrowFunctionExpression']",
    message:
      "No IIFEs. Extract a named helper, or compute the value with a plain expression.",
  },
  {
    // "Use async/await, not `.then()` chains."
    selector: "CallExpression[callee.property.name='then']",
    message: "Use async/await, not `.then()` chains.",
  },
];

// Test-file superset: the general selectors plus the Vitest test conventions.
const testNoRestrictedSyntax = [
  ...noRestrictedSyntax,
  {
    // "Use `describe`/`it` from Vitest (not `test`)."
    selector:
      "CallExpression[callee.name='test'], CallExpression[callee.object.name='test']",
    message: "Use `describe`/`it` from Vitest, not `test()`.",
  },
  {
    // "Do not use `.toBeInTheDocument()`."
    selector: "MemberExpression[property.name='toBeInTheDocument']",
    message:
      "Do not use `.toBeInTheDocument()`; use `.toBeDefined()` or check `.textContent`.",
  },
];

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/next-env.d.ts",
      ".claude/**",
      ".git-worktrees/**",
      ".storybook/**",
      "src/components/ui/**",
      "storybook-static/**",
      "vitest.config.mts",
    ],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Static enforcement of the prose code-style conventions in CLAUDE.md that
  // were previously only caught by eye in /review. No new dependency — every
  // rule is core ESLint or typescript-eslint (already installed via the
  // strictTypeChecked preset above). The CLAUDE.md prose for these rules is
  // deliberately kept brief: the rule is the source of truth.
  {
    files: ["src/**/*.{ts,tsx}", "*.{ts,tsx}"],
    rules: {
      // "Use module-level `import type`." Auto-fixes value imports of
      // type-only bindings into a separate `import type` statement.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "no-restricted-syntax": ["error", ...noRestrictedSyntax],
    },
  },
  // Test files get the general selectors plus the Vitest test-only conventions.
  // This block follows the general one so it wins for spec/test files (the
  // array rule does not merge across configs).
  {
    files: [
      "src/**/*.spec.{ts,tsx}",
      "src/**/*.test.{ts,tsx}",
      "src/**/*-tests/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": ["error", ...testNoRestrictedSyntax],
    },
  },
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}", "*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Module-boundary enforcement (eslint-plugin-boundaries). Foundation for the
  // vertical/domain restructure tracked in #383. Each top-level directory under
  // src/ is a "layer" element; each src/components/<family> directory is a
  // component "domain" (captured as `family`). src/components/ui is its own
  // unrestricted element so the shadcn primitives stay deep-importable, matching
  // the existing eslint ignore of src/components/ui/**.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "boundaries/dependency-nodes": ["import", "dynamic-import"],
      "boundaries/elements": [
        { type: "ui", pattern: "src/components/ui" },
        {
          type: "components",
          pattern: "src/components/*",
          capture: ["family"],
        },
        { type: "app", pattern: "src/app" },
        { type: "hooks", pattern: "src/hooks" },
        { type: "lib", pattern: "src/lib" },
        { type: "server", pattern: "src/server" },
        { type: "services", pattern: "src/services" },
        { type: "store", pattern: "src/store" },
      ],
    },
    rules: {
      // Dependency-direction DAG: lib/store/services are lower layers and must
      // not import from the higher UI-facing layers (app, components, hooks, ui).
      // Everything else stays permissive so CI is green today (verified: zero
      // such imports exist); the direction is tightened as the restructure
      // proceeds under #383. Uses the v7 `dependencies` rule with object-based
      // selectors (the actively-maintained successor to `element-types`).
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: {
                element: { types: { anyOf: ["lib", "services", "store"] } },
              },
              disallow: {
                to: {
                  element: {
                    types: { anyOf: ["app", "components", "hooks", "ui"] },
                  },
                },
              },
              message:
                "{{from.type}} is a lower layer and must not import from the higher layer {{to.type}}.",
            },
          ],
        },
      ],
      // Public-interface (barrel) rule — DEFERRED under #383. The intent is that
      // a component domain's index.ts is its only cross-domain entry point, so
      // cross-domain imports go through the barrel while intra-domain deep
      // imports stay allowed. It is staged as "off" rather than active because
      // `pnpm lint` runs `eslint --max-warnings 0`, so even a "warn" severity
      // fails CI; and 26 cross-domain deep imports exist today across domains,
      // four of which (accounts, home, ledger-detail, reconcile) have no barrel
      // yet. Enabling it requires adding those barrels and routing the imports
      // through them — tracked as follow-up work under #383. The `family`
      // capture above is the scaffolding this rule will build on. Flip to
      // "error" once the barrels and import rewrites land.
      "boundaries/entry-point": "off",
    },
  },
  // File-length caps (CLAUDE.md hard cap: 2× the recommended max). Enforced by
  // ESLint's built-in max-lines rule via the Lint job, replacing the former
  // bespoke file-length.yml workflow + scripts/check-file-length.mjs. Physical
  // lines are counted (blank lines and comments included) to match the prior
  // check. The test override follows so it wins for spec/test files.
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: false, skipComments: false },
      ],
    },
  },
  {
    files: [
      "**/*.spec.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "**/*-tests/**/*.{ts,tsx}",
    ],
    rules: {
      "max-lines": [
        "error",
        { max: 600, skipBlankLines: false, skipComments: false },
      ],
    },
  },
  // Test files use Response.json() which inherently returns `any`; relax unsafe rules
  {
    files: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  // Storybook stories use loose patterns; skip strict type checking
  {
    files: ["src/**/*.stories.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
);
