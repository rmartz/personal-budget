# Code Standards

## Package Manager

- Always use `pnpm`. Never `npm` or `yarn`.

## Dependencies

- **Pin every `package.json` version specifier to a full `major.minor.patch`.** A range
  annotation (`^`, `~`) is allowed as a prefix, but the version after it must always be the
  complete three-part semver — `"^3.8.3"` or `"~3.8.3"`, never `"^3"` or `"^3.8"`. This holds
  for `dependencies`, `devDependencies`, and any other dependency block.
- The reason is dependency-update visibility. Dependabot preserves the existing constraint
  style when it bumps a package, so a full pin like `"^3.8.3" → "^3.9.0"` is recorded as a
  diff in `package.json` itself, not buried in `pnpm-lock.yaml` alone. A short pin like `"^3"`
  satisfies any 3.x release, so a minor/patch bump changes only the lockfile — the update
  becomes invisible in `package.json` and easy to miss in review (e.g. a Prettier minor bump
  that silently changes formatting). Full pins keep every bump explicit.
- `pnpm run check:package-pins` (`scripts/check-package-pins.mjs`) enforces this rule across
  every `package.json`; it also enforces the stricter exact pin (no range annotation) for
  Prettier and its plugins. The `Package Pins` CI workflow runs it, gated to PRs that touch
  `package.json` or `pnpm-lock.yaml`.

## GitHub Actions

- **Pin every external GitHub Action to a full commit SHA _and_ a full `major.minor.patch`
  version comment**: `uses: actions/checkout@<40-hex-sha> # v7.0.0`. A mutable tag (`@v7`) can be
  re-pointed at malicious code by a compromised maintainer or token; an immutable SHA cannot.
  The `# vMAJOR.MINOR.PATCH` comment is required, not cosmetic — Dependabot reads it to know the
  current version, and tracks partial comments (`# v7`, `# v7.0`) inconsistently, so a SHA with
  no or partial version comment is pinned but un-updatable. Local composite actions
  (`./.github/actions/*`) and `docker://` image refs are exempt — they are not mutable Git tags.
- `pnpm run check:action-pins` (`scripts/check-action-pins.mjs`) enforces **both** the SHA pin
  and a full-semver version comment across every workflow and composite action; the `Action
Pins` CI workflow runs it, gated to PRs that touch `.github/`. Dependabot's `github-actions`
  updater then bumps the SHA and the `# vX.Y.Z` comment together on new releases.

## Common Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Lint
pnpm format           # Format
pnpm test             # Run tests with Vitest
pnpm tsc              # Type check
pnpm storybook        # Start Storybook dev server (port 6006)
pnpm build-storybook  # Build static Storybook
pnpm run env:validate # Validate deployment config files against schema
```

Local environment-config management (pulling `.env.local`, syncing values to
Vercel) previously ran through `vercel-deploy-scripts`; it is being replaced by a
local `envctl` CLI (forthcoming). `pnpm run env:validate` is the one env command
that remains in `package.json` (a local script with no external dependency).

## Worktree Setup

After creating a git worktree (`git worktree add .git-worktrees/<name>`), run `pnpm install --frozen-lockfile` inside it before invoking any build, lint, format, type-check, or test commands. pnpm's `node-modules` linker creates per-directory `node_modules` trees; a fresh worktree has none. This step typically requires no network access when the global store is already populated, since only hardlinks are created — it takes a few seconds.

## Deployment Config

Public (non-secret) environment config lives in `deployment/{env}.yml` and is validated against `deployment/schema.yml`. Only `NEXT_PUBLIC_*` and explicitly allowlisted keys are permitted; patterns matching `*SECRET*`, `*_TOKEN*`, or `*PRIVATE_KEY*` are hard-denied.

- To validate config files against schema locally: `pnpm run env:validate` (also runs in the pre-commit hook and the CI `Validate Config` workflow).
- Syncing config values to Vercel and pulling a local `.env.local` were provided by `vercel-deploy-scripts` (now removed); a local `envctl` CLI will replace them (forthcoming, local-only — not wired into CI).
- Secret scanning (gitleaks) was provided by `vercel-deploy-scripts` and has been removed with it — there is currently **no** gitleaks scan locally or in CI. Restoring secret scanning is expected to come with the new env tooling. Until then, take extra care not to commit secrets (`.gitleaks.toml` is retained for when scanning returns).

## TypeScript

- Strict mode throughout. No `any` types. No `@ts-ignore`.
- Do not use `null` unless required for API compatibility or when explicitly distinguishing `null` from `undefined`. Prefer `undefined` for absent/optional values throughout the codebase.
- Prefer explicit `interface` names scoped to their component (e.g., `interface UserProfileCardProps` not `interface Props`).
- Use `async/await`, not `.then()` chains.

## File Organization

- **Source files**: Keep under ~200 lines (split at ~240). Large files should be split by logical concern.
- **Test files**: Keep under ~300 lines (split at ~360). Use `.spec.ts` / `.spec.tsx` extension (not `.test.ts`). When splitting, organize into a `{module}-tests/` directory with domain-specific files.
- **Hard caps are enforced by ESLint** (`max-lines` in `eslint.config.js`, run by the `Lint` CI job and `lint-staged`): 400 lines for source `*.{ts,tsx}`, 600 for `*.spec`/`*.test`/`*-tests/` files. These are 2× the recommended maxima above — a backstop, not the target. A file over its cap fails lint, so split it before committing.
- **Components**: A component file contains its primary component and props interface. A sub-component may be co-located in the same file if it owns no hooks, state, effects, or context, and is used only by the parent component in that file — e.g., a context wrapper, structural template, or props alias. A sub-component must be in its own file when any of these are true: it owns hooks, state, effects, or context; it is referenced from multiple parents; or it is substantial enough to warrant its own stories or tests (e.g., list items, row components, panels, form sections). All component props must be defined as an explicitly named interface (e.g., `interface UserListProps`), never inline in the function signature.
- **In-scope splitting of substantially-modified oversized files**: When a PR substantially modifies a file and that change pushes it past the recommended split threshold (more than 20% over the line limit — i.e. ~240 lines for source, ~360 for tests), splitting that file by logical concern is **in scope for the same PR**, not a separate change to defer. If the `/review` skill observes such a file that was _not_ split, it decides — based on how substantial the modification was — whether to require the split within that PR or to defer it to a follow-on `Tech Debt` ticket. Require the split in-PR when the file was substantially reworked; defer to a ticket when the change to the oversized file was incidental or small relative to its size. Either way the unsplit oversized file should not pass silently — it is flagged for a decision.
- **Type files**: Convert large type files into barrel-exported directories with one file per logical domain.
- Add a barrel `index.ts` when a component or module directory exposes a public API or already
  follows a barrel pattern; do not require one for every directory (e.g. ShadCN-generated
  `src/components/ui/` has no barrel by convention).
- Use named exports, not default exports (except for Next.js pages, Redux slices, and
  Storybook story files, where the only allowed default export is the required
  `export default meta`; stories and components must remain named exports).

## Code Conventions

- **Favor type inference.** Explicit generic type arguments (for example, `someFn<Foo>(...)`) are a code smell when TypeScript can infer them.
- **No spurious variables.** Do not assign a value to a variable only to immediately return it on the next line — return the expression directly instead.
- **No IIFEs.** Do not use immediately-invoked function expressions. Extract the logic into a named helper function or compute the value with a plain expression instead.
- **No function-style imports.** Do not use inline `import("…").Type` syntax in type annotations. Use module-level `import type { … } from "…"` statements at the top of the file. Dynamic `await import("…")` for services that require conditional loading (e.g., Sentry instrumentation) is acceptable.
- **No unnecessary helpers.** Do not extract logic into a helper function unless it separates significant logic or belongs in a different module. Three similar lines is better than a premature abstraction.
- **Alphabetical ordering** applies wherever sequence has no semantic value, to minimize merge conflicts:
  - **Import statements** — enforced automatically by ESLint (`simple-import-sort`). Run `pnpm lint --fix` to auto-correct.
  - **Enum members and `as const` objects** — kept in alphabetical order by convention (no automated enforcement yet; reviewers should flag violations).
  - **Re-exports in barrel files** — enforced automatically by ESLint alongside import statements.
- **Default fixed value-sets to a structural type, not an `enum`.** For a fixed set of named values use a string union (`type Tier = "investment" | "reserve"`), or an `as const` array when you also need the values at runtime for validation/iteration (`const TIERS = ["investment", "reserve"] as const; type Tier = (typeof TIERS)[number]`). Both stay **structural**, so serialized/wire strings — Firebase documents, query params, API payloads — assign without a cast and emit ~no runtime. A string `enum` is **nominal**: it rejects the underlying literal and forces a cast at every serialization boundary, and a plain `enum` ships a runtime object (`const enum` is unavailable under `isolatedModules`). The deciding question is the serialization boundary: a value that crosses a wire/persistence boundary with no converter seam → structural union / `as const`; an **internal-only** set you iterate as a unit and never serialize raw → an `enum` is fine. An enum already isolated behind a converter seam (`{domain}ToFirebase()` / `firebaseTo{Domain}()`) also stays — the seam centralizes the boundary; the `src/lib/firebase/schema/` enums sit here deliberately and should not be churned. Export any enum you keep from the module barrel.

## Naming Conventions

- **Firebase schema conversions**: `{domain}ToFirebase()` / `firebaseTo{Domain}()`.
- **Redux slices**: File suffix `-slice.ts`.
- **Presentational views**: Components extracted for testability use the `{Component}View` suffix.

## User-Facing Text

- For any new or modified UI component, store user-facing strings in a co-located copy file
  (e.g., `ComponentName.copy.ts` or `copy.ts`) for internationalization (i18n) readiness.
  Do not introduce new hardcoded display strings inline in components you are actively changing.

  Existing hardcoded strings elsewhere in the codebase are technical debt to be migrated over
  time; this rule does not require unrelated cleanup.

- Copy files export a single `as const` object named `{SCOPE}_COPY` (e.g., `HOME_PAGE_COPY`, `USER_PROFILE_COPY`).

## Documentation

- Keep documentation in sync with the code — outdated docs are worse than no docs.
- Reference docs under `docs/` follow the [Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md): every page begins with a YAML frontmatter block whose only required key is `type` (drawn from the vocabulary in [`docs/index.md`](docs/index.md) — `Schema`, `Reference`, `Guide`), plus the recommended `title`, `description`, `resource` (path to the asset the page documents), and `tags`. When adding a new `docs/` page, include the frontmatter and add a listing entry to `docs/index.md`.

## React / Next.js Standards

### Framework

- Next.js with App Router (not Pages Router).
- UI components: ShadCN UI. Do not install other component libraries.
- Styling: Tailwind CSS (comes with ShadCN). No CSS modules or styled-components.

### Client Components

- `"use client"` directive required on all React client components (Next.js App Router).
- React hooks must be called unconditionally — hooks before any early returns.

### JSX

- **No imperative logic inside JSX.** Imperative logic means anything that requires a statement rather than an expression: `const`/`let` declarations, `if`/`switch` blocks, loops, or any sequence of statements that produces a result through side effects. All such logic must live in the component body before the `return` statement, or be extracted into a child component. Expressions of any complexity are permitted directly in JSX — ternaries, logical operators (`&&`, `||`, `??`), method chains (`.map()`, `.filter()`, `.find()`), nested function calls, and template literals are all fine as long as they form a single expression with no intermediate bindings. Multi-statement callback functions passed as JSX props (e.g. `onChange={(e) => { setValue(e.target.value); setError(undefined); }}`) are permitted — the prohibition targets imperative logic in JSX structure, not callback bodies.

### Component Structure

- Components should have a single JSX return statement. Invalid states should be prevented by the type system or guarded against by the calling component. An early `return null` can be acceptable if the invalid state is infeasible for the parent component to detect, but the component itself should be returned as a single JSX block.

## Storybook

- Story files are co-located with their component: `ComponentName.stories.tsx`.
- When adding or modifying a UI component, add or update its Storybook story to cover key visual states.
- Stories should use mock data fixtures — never import from Firebase or depend on runtime providers (QueryClient, Redux store, Next.js router).
- Components that are too hook-dependent to render in isolation should use a presentational split: extract rendering into a `ComponentNameView` that accepts callbacks, and keep the original as a thin wrapper that wires up hooks.

## Component Tests

- Test files are co-located with their component: `ComponentName.spec.tsx`.
- When adding or modifying a UI component, add or update its test to verify rendering behavior and key prop-driven states.
- Use `@testing-library/react` with `vitest`. Always call `afterEach(cleanup)`.
- Do not use `.toBeInTheDocument()` — use `.toBeDefined()` or check `.textContent` instead.
- Assert against copy constants (e.g., `HOME_PAGE_COPY`) rather than hardcoded strings.
- Test presentational view components directly; avoid mocking hooks in tests where possible.

## Testing Conventions

- Use `describe`/`it` from Vitest (not `test`).
- Test fixture generators use `make{DomainName}()` (e.g., `makeUser()`, `makeSession()`).
- When splitting large test files, organize into `{module}-tests/` directories.

### Test Design

- **Control inputs and outputs.** Do not rely on a function's default return values as the assertion of a test unless the purpose of the test is specifically to verify those defaults. Use explicit, non-default values so a passing test proves the value was produced by logic, not inherited from an initializer.
- **One reason to fail per test.** Each test should assert a single logical outcome. Helper functions are fine, but if a test invokes two functions from the codebase it should be explicitly testing how those two interact. Incidental coverage of a second function is not a reason to combine assertions.
- **Keep tests simple.** A failing test should make it immediately obvious whether the failure is a bug or an intentional change in behavior. If understanding a failure requires reading more than one layer of test setup or multiple assertions, split the test.
- **Granularity scales with level of abstraction.** Low-level functions (pure utilities, serializers) warrant thorough edge-case coverage. High-level functions (service orchestration) should have smoke tests that verify they correctly apply the lower-level logic — not re-test every edge case that belongs in the lower-level tests.

## Firebase Schema Migrations

- **Never make a breaking schema change without a migration.** A breaking change is any modification to the Firebase Realtime DB path structure or field format that would cause existing stored data to be misread, ignored, or crash the application — for example: renaming a path segment, changing a field's type, removing a required field, or altering an enum's serialized value.
- Before merging a breaking schema change, provide a migration script in `scripts/migrations/` that reads the old data shape and writes it in the new shape. The script must be idempotent (safe to run multiple times) and must not delete old data until the migration is verified complete.
- Additive changes (new optional fields with safe defaults in `firebaseTo*()` helpers, new path segments that existing code ignores) are not breaking and do not require a migration.
- Document the migration in `docs/database-schema.md` alongside the schema change, keeping its OKF frontmatter (see the Documentation section) accurate.

## GitHub Issues

- When picking the next task from a milestone, use `gh issue list --milestone "<milestone title>" --state open`.

## Git Conventions

- Branch names: lowercase with hyphens, prefixed by type: `feature/`, `chore/`, `refactor/`, `docs/`, with issue number suffix (e.g., `feature/user-profile-42`).
- Commit messages: imperative verbs (Add, Implement, Fix, Update, Extract, Remove). No `feat:`/`fix:` prefixes.
- PR titles must follow Conventional Commits format: `<type>: description` or `<type>(<scope>): description`. Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`. A `!` suffix is allowed before the colon to denote breaking changes (e.g., `feat!: remove legacy auth`). This is enforced by CI.
- PR descriptions must use `Closes #123`, `Fixes #123`, or `Resolves #123` to trigger GitHub's automatic issue close on merge. Phrases like "Addresses #123" or "Related to #123" do NOT trigger auto-close.
- PR descriptions must be descriptive prose, not a task checklist. A good description covers: (1) what the PR does and why, (2) key technical decisions or non-obvious implementation choices, and (3) for PRs with user-facing changes, manual testing steps. Task checklists, placeholder text, and generated implementation logs are not acceptable substitutes.
- **Vercel preview deploys are label-driven.** A preview exists to enable UAT, so one is deployed only when a PR is labelled `ready for UAT` — the `Preview Deploy` workflow (`.github/workflows/preview-deploy.yml`) deploys via the Vercel CLI and posts the URL as a sticky PR comment. Automatic Git-integration previews are disabled: `scripts/vercel-ignore-build.sh` (wired via `ignoreCommand` in `vercel.json`) builds production `main` only and skips every preview build. So branch prefix and PR title no longer affect previews; add `ready for UAT` to get one.
