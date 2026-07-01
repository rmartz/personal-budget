#!/usr/bin/env bash
#
# Vercel "Ignored Build Step" gate.
#
# Preview deploys exist solely for UAT, so a preview is only worth building when
# the PR introduces a user-facing change — a `feat` or `fix`. chore/docs/ci/
# refactor/test/style/build PRs are skipped; they have no functional impact a
# preview would help verify.
#
# The type is read from the PR title (Conventional Commits, enforced by the
# pr-title-lint CI check), NOT the branch name: every branch in this repo is
# named `feat/*` regardless of work type, and in-branch commit messages are
# intentionally non-conventional, so neither is a reliable type signal. The repo
# is public, so the PR title is fetched from the GitHub API unauthenticated — no
# token or secret is required.
#
# Exit code contract (Vercel): 1 = build, 0 = skip.
#
# Fail-safe bias: any uncertainty (production branch, no associated PR, API
# error, empty title) BUILDS. A preview a tester needs is never silently
# withheld; the worst case is one extra build.
set -uo pipefail

ref="${VERCEL_GIT_COMMIT_REF:-}"
pr="${VERCEL_GIT_PULL_REQUEST_ID:-}"
owner="${VERCEL_GIT_REPO_OWNER:-}"
slug="${VERCEL_GIT_REPO_SLUG:-}"

build() {
  echo "$1"
  exit 1
}
skip() {
  echo "$1"
  exit 0
}

[ "$ref" = "main" ] && build "Production branch 'main' — building."
[ -z "$pr" ] && build "No associated pull request — building (type unknown)."
{ [ -z "$owner" ] || [ -z "$slug" ]; } && build "Repo owner/slug unavailable — building."

title="$(curl -sS --max-time 10 -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$owner/$slug/pulls/$pr" |
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).title??"")}catch{process.exit(1)}})' 2>/dev/null)" ||
  build "Could not fetch PR #$pr title — building (fail-safe)."

[ -z "$title" ] && build "Empty PR #$pr title — building (fail-safe)."

if printf '%s' "$title" | grep -Eq '^(feat|fix)(\([^)]*\))?!?:'; then
  build "PR #$pr is feat/fix ('$title') — building preview."
else
  skip "PR #$pr is not feat/fix ('$title') — skipping preview."
fi
