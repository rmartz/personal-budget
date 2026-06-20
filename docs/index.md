This directory follows the [Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md): each page is a markdown file with a YAML frontmatter block, and pages cross-link with normal markdown links. The frontmatter lets agents retrieve the right reference material before a task without parsing prose.

Each page's `type` is drawn from this repo's vocabulary:

- **Schema** — structured descriptions of a data shape or storage layout (fields, paths, types).
- **Reference** — factual reference material for a subsystem (architecture, deployment config, domain glossary).
- **Guide** — procedural how-to documentation (setup steps, runbooks).

This is a `type` convention, not a closed set — add a new value when none fits, and record it here.

# Schema

- [Firebase Realtime Database Schema](database-schema.md) - Path structure, field formats, and security rules for all user data in the Firebase Realtime Database.
