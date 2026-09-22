---
type: Reference
title: Storybook CI (shared rmartz/storybook-ci)
description: How this repo's Storybook story suite and screenshot gallery are delegated to the shared rmartz/storybook-ci reusable workflows — what the two callers configure, why Storybook Build stayed local, the resulting check contexts, and the STORYBOOK_SCREENSHOT_PAT setup.
resource: ../.github/workflows/storybook-tests.yml
tags: [storybook, ci, screenshots, github-actions]
---

# Storybook CI

This repo's Storybook story suite and screenshot gallery are two thin caller
workflows that delegate to the shared
[`rmartz/storybook-ci`](https://github.com/rmartz/storybook-ci) reusable
workflows. The operational reasoning — Chromium provisioning and binary caching
with a retry, change gating, fail-vs-cancel deadline budgeting, per-PR
concurrency, fork exclusion, advisory isolation — lives upstream, once, so a fix
there reaches us through a Dependabot pin bump rather than an edit here.

## The two callers

| File                                          | Role     | What it configures                                             |
| --------------------------------------------- | -------- | -------------------------------------------------------------- |
| `.github/workflows/storybook-tests.yml`       | Gating   | `run-build: false` — nothing else.                             |
| `.github/workflows/storybook-screenshots.yml` | Advisory | `on.paths` (`src/**`, `.storybook/**`) and `secrets: inherit`. |

Every other shared default already resolves here: `pnpm exec vitest run --project
storybook` matches the `storybook` project in
[`vitest.config.mts`](../vitest.config.mts), `pnpm build-storybook` and
`storybook-static` match `package.json`, the `src/**/*.stories.@(ts|tsx)` story
glob matches this repo's co-located stories, and Node 24.x matches
[`.github/actions/setup`](../.github/actions/setup/action.yml).

## Why `Storybook Build` stayed in ci-actions.yml

The shared workflow offers a `Storybook Build` job, and this repo does **not** use
it (`run-build: false`). The shared job is deliberately browser-free — it compiles
the bundle and stops — but this repo's build job does one more thing:

```yaml
- run: pnpm build-storybook
- name: Canary render check
  run: node scripts/check-storybook-render.mjs
```

[`scripts/check-storybook-render.mjs`](../scripts/check-storybook-render.mjs)
serves the built `storybook-static/` and renders Redux-connected canary stories in
real Chromium, asserting each mounts. It is the standing watchdog for the Vite 8 /
Rolldown tree-shaking regression ([#359](https://github.com/rmartz/personal-budget/issues/359)),
which dropped reselect from the _built_ bundle — a failure neither the compile nor
the Vitest story suite (which renders through the dev/esbuild transform) detects,
so it would otherwise return silently on a future bundler bump.

That guard needs a browser in the build job, which the shared `build-command`
input cannot request. Folding the Playwright install into `build-command` would
work but would pay an uncached ~130 MB Chromium download on every run, so the
`storybook-build` job stays local with the cached
[`playwright-chromium`](../.github/actions/playwright-chromium/action.yml)
composite action. Upstream support for a browser-enabled build job is requested in
[rmartz/storybook-ci#21](https://github.com/rmartz/storybook-ci/issues/21); if it
lands, this job can move too and `run-build` can flip back to its default.

## Check contexts

A reusable workflow's check context is `<caller job> / <called job>`, so adoption
renames the story-suite check:

| Before                  | After                                         |
| ----------------------- | --------------------------------------------- |
| `Storybook Tests`       | `storybook-tests / Storybook Tests`           |
| `Storybook Build`       | `Storybook Build` (unchanged, local)          |
| `Storybook Screenshots` | `screenshots / Capture Storybook Screenshots` |

`Storybook Build` is the only one of the three in the default-branch ruleset's
required checks, and it is unchanged — so adoption needs no ruleset edit to avoid
hanging PRs. Adding `storybook-tests / Storybook Tests` to the required set is a
separate, optional tightening.

## Why the screenshots caller has `on.paths` and the tests caller does not

Gating for the tests caller is the shared workflow's `detect-changes` job plus a
per-job `if:`. A job skipped by an `if:` counts as passing, but a required check
that never runs because its `on.paths` did not match hangs the PR forever — so
**never** add `paths` to `storybook-tests.yml`, even though it is not required
today. The screenshots caller is advisory and never a required check, so `on.paths`
is safe there and keeps it off unrelated PRs.

Neither caller filters on `branches`, so both run on stacked PRs that target a
feature branch rather than `main`.

## Which stories get screenshotted

The shared default resolver is `colocation`: a PR's directly changed story files,
plus the stories co-located in the same directory as any changed component file. A
change under `.storybook/**` cannot be localized to specific stories and forces a
full capture.

That is deliberately broader than the previous bespoke gate, which captured only
directly changed `*.stories.tsx` files and therefore regenerated nothing when a
component was edited without touching its story. The residual gap of `colocation`
is a changed component whose story lives in a different directory; see the upstream
[change-filtering reference](https://github.com/rmartz/storybook-ci/blob/main/docs/change-filtering.md)
for the other resolver modes.

## The screenshot PAT

The GitHub user-attachments upload endpoint (`gh --attach`) rejects the Actions
`GITHUB_TOKEN`, so the shared workflow authenticates `gh` with a user-level PAT
named **`STORYBOOK_SCREENSHOT_PAT`**, forwarded by `secrets: inherit`.

Create it as a **fine-grained** PAT — measured working upstream, and a fraction of
the blast radius of the classic `repo` scope:

| Field                  | Value                                            |
| ---------------------- | ------------------------------------------------ |
| Type                   | Fine-grained PAT                                 |
| Repository access      | **Only select repositories** → `personal-budget` |
| Repository permissions | **Pull requests: Read and write**                |
| Expiration             | set one                                          |

`Metadata: Read` is granted automatically. **`Contents` is not required** — do not
add it; `actions/checkout` clones with the job's own `GITHUB_TOKEN`, and the PAT
authenticates only the attachment upload and the comment write. Add the token as
an **Actions** secret (an Agent secret is not readable by Actions) at
`Settings → Secrets and variables → Actions`.

Until the secret exists, the workflow is advisory and never blocking: a preflight
step detects a missing or invalid PAT, posts one update-in-place advisory PR
comment, and skips the expensive build and capture. A green screenshots job on a PR
that touches no story or co-located component has **not** exercised the PAT, so
validate a new token with a PR that actually changes one.

## Keeping the pin current

Each caller pins the shared workflow by full commit SHA with a `# vX.Y.Z` comment.
Dependabot's `github-actions` ecosystem reads that comment to map the SHA to a
release and bumps the SHA and comment together — so the comment is required, not
decorative. The repo's `action-pins` hygiene check enforces both halves.

## What this replaced

- `.github/workflows/pr-screenshots.yml` and
  `.github/scripts/storybook-screenshots.mjs` — the bespoke Playwright capture and
  gallery-comment script.
- `.github/workflows/pr-screenshots-cleanup.yml` and the per-PR orphan image branch
  `gh-screenshots-pr-<N>`. `gh --attach` hosts the images natively, so there is no
  branch to tear down and no `contents: write` grant.
- The `storybook-tests` job in `ci-actions.yml`.
