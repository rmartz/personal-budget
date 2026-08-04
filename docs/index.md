This directory follows the [Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md): each page is a markdown file with a YAML frontmatter block, and pages cross-link with normal markdown links. The frontmatter lets agents retrieve the right reference material before a task without parsing prose.

Each page's `type` is drawn from this repo's vocabulary:

- **Schema** — structured descriptions of a data shape or storage layout (fields, paths, types).
- **Reference** — factual reference material for a subsystem (architecture, deployment config, domain glossary).
- **Guide** — procedural how-to documentation (setup steps, runbooks).
- **Design** — forward-looking design proposals and architecture plans for features not yet built (or mid-build).

This is a `type` convention, not a closed set — add a new value when none fits, and record it here.

# Schema

- [Firebase Realtime Database Schema](database-schema.md) - Path structure, field formats, and security rules for all user data in the Firebase Realtime Database.

# Guide

- [Staging Test Accounts](staging-test-accounts.md) - The seeded email/password test users in the staging Firebase project and how to (re-)seed them.

# Design

- [Savings Goal Liquidity Planning](savings-goal-liquidity-planning.md) - Purchase-date-aware savings goals that glide funds between investments and cash to hit expected purchase dates without forced sales, via a planning layer that emits a thin liquidity target the reconcile engine executes.
