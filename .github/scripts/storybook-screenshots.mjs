#!/usr/bin/env node
/**
 * Captures Playwright screenshots for every Storybook story whose source file
 * changed in the PR, pushes them to a per-PR `gh-screenshots-pr-<N>` branch,
 * and posts (or updates) a sticky PR comment with an inline gallery.
 *
 * The per-PR branch is owned solely by this PR, so it is concurrency-safe by
 * construction — no PR ever writes another PR's branch. Each run rebuilds the
 * branch from a fresh orphan commit and force-pushes it, giving clean
 * latest-only semantics with no fetch/merge/branch-exists/retry complexity. A
 * companion `pr-screenshots-cleanup.yml` workflow deletes the branch when the
 * PR closes so branches don't accumulate. See the synthesis in
 * rmartz/group-picks#339 for why a per-PR surface replaced the old shared
 * `gh-screenshots` branch (the source of the cross-PR concurrency saga).
 *
 * Fail fast, don't time out: capture is bounded by an internal wall-clock
 * deadline (CAPTURE_DEADLINE_MS, default 4 min) kept below the job's
 * `timeout-minutes`. A hung or overrunning render exits non-zero *before* the
 * job cap, so the check reports a `failure` (agent-fixable → fix-review)
 * rather than a `cancelled` (which requires human escalation).
 *
 * Expected environment variables:
 *   GITHUB_TOKEN        – token with contents:write and pull-requests:write
 *   REPO                – "owner/repo"
 *   PR_NUMBER           – pull request number
 *   CHANGED_FILES       – newline-separated list of changed *.stories.tsx paths
 *   PR_HEAD_SHA         – HEAD SHA of the PR branch
 *   CAPTURE_DEADLINE_MS – optional wall-clock budget for capture (default 240000)
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { createServer } from "http";
import { extname, join } from "path";
import { chromium } from "playwright";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const REPO = process.env.REPO ?? "";
const PR_NUMBER = process.env.PR_NUMBER ?? "";
const CHANGED_FILES = process.env.CHANGED_FILES ?? "";
const PR_HEAD_SHA = process.env.PR_HEAD_SHA ?? "";

const COMMENT_MARKER = "<!-- storybook-screenshots-bot -->";
const SCREENSHOTS_BRANCH = `gh-screenshots-pr-${PR_NUMBER}`;
const STORYBOOK_PORT = 6006;
const NAV_TIMEOUT_MS = 15_000;
const RENDER_TIMEOUT_MS = 8_000;

// A story is "rendered" once something visible appears. Most stories mount into
// #storybook-root, but overlay components (Dialog, AlertDialog) render their
// content into a portal on document.body — outside #storybook-root — so an
// open-dialog story leaves the root empty. Accept a visible portal overlay as
// an equivalent ready signal. page.screenshot() shoots the whole viewport, so
// the portal is included.
const RENDER_READY_SELECTOR = [
  "#storybook-root > *",
  "[role='dialog']",
  "[role='alertdialog']",
].join(", ");

// Wall-clock budget for the whole capture pass. Kept below the job's
// `timeout-minutes` so an overrun fails fast (non-zero exit → job `failure` →
// fix-review) instead of being cancelled at the job cap (→ human escalation).
const CAPTURE_DEADLINE_MS = Number(process.env.CAPTURE_DEADLINE_MS ?? "240000");

const MIME_TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "application/javascript",
  ".json": "application/json",
  ".mjs": "application/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

// ---------------------------------------------------------------------------
// Story discovery
// ---------------------------------------------------------------------------

const changedFiles = CHANGED_FILES.split("\n")
  .map((f) => f.trim())
  .filter((f) => f.length > 0);

if (changedFiles.length === 0) {
  console.log("No changed story files found — skipping.");
  process.exit(0);
}

const indexJson = JSON.parse(
  readFileSync("storybook-static/index.json", "utf8"),
);
const allEntries = Object.values(indexJson.entries ?? {});

const matchingStories = allEntries.filter((entry) => {
  if (entry.type !== "story") return false;
  // importPath is like "./src/components/Foo/Foo.stories.tsx"
  const normalized = entry.importPath.replace(/^\.\//, "");
  return changedFiles.some((f) => f === normalized);
});

if (matchingStories.length === 0) {
  console.log("No matching stories for changed files — skipping.");
  process.exit(0);
}

console.log(`Found ${matchingStories.length} stories to screenshot.`);

// ---------------------------------------------------------------------------
// Static file server for storybook-static/
// ---------------------------------------------------------------------------

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = req.url.split("?")[0];
      const filePath = join(
        "storybook-static",
        urlPath === "/" ? "index.html" : urlPath.replace(/^\//, ""),
      );
      const mime = MIME_TYPES[extname(filePath)] ?? "application/octet-stream";
      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { "Content-Type": mime });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(STORYBOOK_PORT, () => resolve(server));
  });
}

// ---------------------------------------------------------------------------
// Screenshot capture
// ---------------------------------------------------------------------------

async function captureScreenshots() {
  const server = await startStaticServer();
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const story of matchingStories) {
      console.log(`  Screenshotting: ${story.title} / ${story.name}`);
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });

      const url = `http://localhost:${STORYBOOK_PORT}/iframe.html?id=${story.id}&viewMode=story`;
      try {
        // `domcontentloaded` (not `networkidle`, which can hang on animations or
        // polling) so no single story can stall the run; the visibility wait
        // below is what confirms the story actually rendered.
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: NAV_TIMEOUT_MS,
        });
        await page
          .locator(RENDER_READY_SELECTOR)
          .first()
          .waitFor({ state: "visible", timeout: RENDER_TIMEOUT_MS })
          .catch(() => {
            // Best effort: a story that renders nothing visible in time is still
            // screenshotted (blank), and the gating storybook-tests job is the
            // real render regression net. Don't abort the whole advisory run.
          });

        const buffer = await page.screenshot({ type: "png" });
        results.push({ story, buffer });
      } catch (err) {
        console.error(
          `  Skipping ${story.title} / ${story.name}: ${err.message}`,
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  return results;
}

// ---------------------------------------------------------------------------
// Push screenshots to the per-PR gh-screenshots-pr-<N> branch
// ---------------------------------------------------------------------------

function pushScreenshots(screenshots) {
  const shortSha = PR_HEAD_SHA.slice(0, 7);
  const tmpDir = "/tmp/gh-screenshots-worktree";

  execSync(
    'git config user.email "github-actions[bot]@users.noreply.github.com"',
  );
  execSync('git config user.name "github-actions[bot]"');

  // The per-PR branch is owned solely by this PR, so we always rebuild it from
  // a fresh orphan commit and force-push — no fetch/merge/branch-exists logic.
  execSync(`git worktree add --orphan -b ${SCREENSHOTS_BRANCH} ${tmpDir}`);

  const fileNames = screenshots.map(({ story, buffer }) => {
    const safeName = story.id.replace(/[^a-zA-Z0-9-]/g, "-");
    const fileName = `${safeName}.png`;
    writeFileSync(`${tmpDir}/${fileName}`, buffer);
    return { story, fileName };
  });

  execSync(`git -C ${tmpDir} add -A`);
  execSync(
    `git -C ${tmpDir} commit -m "Screenshots for PR #${PR_NUMBER} (${shortSha})"`,
  );
  execSync(`git -C ${tmpDir} push --force origin ${SCREENSHOTS_BRANCH}`);

  execSync(`git worktree remove --force ${tmpDir}`);
  return fileNames;
}

// ---------------------------------------------------------------------------
// Post or update the sticky PR comment
// ---------------------------------------------------------------------------

function buildRawUrl(fileName) {
  return `https://raw.githubusercontent.com/${REPO}/${SCREENSHOTS_BRANCH}/${fileName}`;
}

function buildCommentBody(fileNames) {
  const shortSha = PR_HEAD_SHA.slice(0, 7);
  const rows = fileNames
    .map(
      ({ story, fileName }) =>
        `| **${story.title}** — ${story.name} | ![${story.name}](${buildRawUrl(fileName)}) |`,
    )
    .join("\n");

  return `${COMMENT_MARKER}
## 📸 Storybook Screenshots

Previews for stories whose \`*.stories.tsx\` changed in this PR.

| Story | Preview |
| --- | --- |
${rows}

<sub>Generated from commit ${shortSha}</sub>`;
}

async function postPrComment(fileNames) {
  const [owner, repoName] = REPO.split("/");
  const apiBase = `https://api.github.com/repos/${owner}/${repoName}`;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "storybook-screenshots-bot",
  };

  const commentBody = buildCommentBody(fileNames);

  // Find an existing bot comment (search through all pages).
  let existingCommentId = null;
  let page = 1;
  outer: while (true) {
    const res = await fetch(
      `${apiBase}/issues/${PR_NUMBER}/comments?per_page=100&page=${page}`,
      { headers },
    );
    if (!res.ok) {
      throw new Error(
        `GitHub API list-comments ${res.status}: ${await res.text()}`,
      );
    }
    const comments = await res.json();
    if (!Array.isArray(comments) || comments.length === 0) break;
    for (const comment of comments) {
      if (comment.body?.includes(COMMENT_MARKER)) {
        existingCommentId = comment.id;
        break outer;
      }
    }
    if (comments.length < 100) break;
    page++;
  }

  const target =
    existingCommentId !== null
      ? `${apiBase}/issues/comments/${existingCommentId}`
      : `${apiBase}/issues/${PR_NUMBER}/comments`;
  const res = await fetch(target, {
    method: existingCommentId !== null ? "PATCH" : "POST",
    headers,
    body: JSON.stringify({ body: commentBody }),
  });
  if (!res.ok) {
    throw new Error(`GitHub API comment ${res.status}: ${await res.text()}`);
  }
  console.log(
    existingCommentId !== null
      ? "Updated existing PR comment."
      : "Posted new PR comment.",
  );
}

// ---------------------------------------------------------------------------
// Main — race capture against a wall-clock deadline so an overrun fails fast.
// ---------------------------------------------------------------------------

let deadlineTimer;
const deadline = new Promise((_, reject) => {
  // Intentionally NOT unref'd: the timer must keep the event loop alive so the
  // deadline fires even if capture stalls with no other active handles. The
  // success path clears it below.
  deadlineTimer = setTimeout(() => {
    reject(
      new Error(
        `capture exceeded CAPTURE_DEADLINE_MS=${CAPTURE_DEADLINE_MS}ms before finishing ${matchingStories.length} stories`,
      ),
    );
  }, CAPTURE_DEADLINE_MS);
});

let screenshots;
try {
  screenshots = await Promise.race([captureScreenshots(), deadline]);
} catch (err) {
  console.error(
    `Screenshot capture failed fast: ${err.message}. Exiting non-zero so this ` +
      `routes to fix-review (a failure) instead of a job-timeout cancellation.`,
  );
  process.exit(1);
}
clearTimeout(deadlineTimer);

if (screenshots.length === 0) {
  console.log("No screenshots captured — skipping.");
  process.exit(0);
}

const fileNames = pushScreenshots(screenshots);
await postPrComment(fileNames);
console.log("Done.");
