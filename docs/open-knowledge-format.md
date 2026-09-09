---
type: Reference
title: Open Knowledge Format (OKF)
description: How this repo structures docs/ as OKF — YAML frontmatter, the type vocabulary, reserved files, and index reachability — with Google's spec as the authoritative reference.
resource: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
tags: [documentation, okf, conventions]
---

# Open Knowledge Format (OKF)

The `docs/` directory is structured as an **Open Knowledge Format (OKF)** knowledge base: a tree of Markdown files, each carrying a small YAML frontmatter block, cross-linked with plain Markdown links. The frontmatter lets an agent — or a person — retrieve the right reference material before a task without reading every page's prose.

> **Authoritative reference.** OKF is defined by Google's specification. For any question this page does not answer — the full frontmatter vocabulary, the optional key families, edge cases — the spec is the source of truth: [`GoogleCloudPlatform/knowledge-catalog` → `okf/SPEC.md`](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md). Where this page and the spec disagree, the spec wins.

## Why OKF here

Unstructured prose docs drift: an agent cannot cheaply tell a schema reference from a runbook from a design proposal, and there is no reliable way to know a page exists at all. OKF addresses both — a required `type` field classifies each page, and an `index.md` per directory makes the tree navigable — so documentation stays discoverable as it grows.

## Frontmatter

Every non-reserved page begins with a YAML frontmatter block. Per the spec the **only required key is `type`** (which must be non-empty); the rest are recommended, not mandatory.

| Key           | Required    | Purpose                                         |
| ------------- | ----------- | ----------------------------------------------- |
| `type`        | **yes**     | Classifies the page (see the vocabulary below). |
| `title`       | recommended | Human-readable page title.                      |
| `description` | recommended | One-line summary used for retrieval.            |
| `resource`    | recommended | Path (or URL) to the asset the page documents.  |
| `tags`        | recommended | Free-form keywords.                             |

A consumer must not reject a page for missing an optional key.

### The `type` vocabulary

This repo draws `type` from a small, open vocabulary, recorded in [`index.md`](index.md):

- **Schema** — structured descriptions of a data shape or storage layout (fields, paths, types).
- **Reference** — factual reference material for a subsystem (architecture, config, glossary).
- **Guide** — procedural how-to documentation (setup steps, runbooks).
- **Design** — forward-looking design proposals for features not yet built (or mid-build).

It is a convention, not a closed set: when none fits, add a new value and record it in `index.md`.

## Reserved files

Two filenames are **reserved** and carry **no** frontmatter:

- **`index.md`** — the directory's navigation page. It lists every page in its own directory and links each immediate subdirectory's `index.md`.
- **`log.md`** — an append-only log, where a directory keeps one.

(The spec permits a bundle-root `index.md` to carry a single `okf_version` key, and nothing else.)

## Index reachability

`docs/` must be navigable from the top-level `index.md` down to any page by following links:

- Every directory that holds docs has an `index.md`.
- Every non-reserved page is linked from the `index.md` in its own directory.
- Every subdirectory's `index.md` is linked from its parent directory's `index.md`.

So a reader can always walk `docs/index.md → sub/index.md → sub/page.md`.

## Enforcement

Both rules — OKF frontmatter on every non-reserved page, and index reachability — are enforced in CI by the **`Docs`** workflow, which runs the zero-dependency validator `scripts/check-docs.mjs`. Run it locally with:

```bash
pnpm run docs:validate
```

See the **Documentation** section of [`AGENTS.md`](../AGENTS.md) for the day-to-day authoring rules.
