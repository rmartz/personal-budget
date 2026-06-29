#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import { parseStoryFile } from "./parse-story-file.mjs";

const DEFAULT_OUTPUT_PATH = ".github/screenshots.dynamic.yml";
const STORYBOOK_BASE_URL = "http://127.0.0.1:6006";

function parseArgs(argv) {
  const args = {
    changedFilesPath: undefined,
    githubOutputPath: undefined,
    outputPath: DEFAULT_OUTPUT_PATH,
  };

  for (const arg of argv) {
    if (arg.startsWith("--changed-files=")) {
      args.changedFilesPath = arg.slice("--changed-files=".length);
      continue;
    }

    if (arg.startsWith("--output=")) {
      args.outputPath = arg.slice("--output=".length);
      continue;
    }

    if (arg.startsWith("--github-output=")) {
      args.githubOutputPath = arg.slice("--github-output=".length);
    }
  }

  if (!args.changedFilesPath) {
    throw new Error("Missing required --changed-files=<path> argument.");
  }

  return args;
}

function resolveStoryFileForChangedFile(repoRoot, changedFilePath) {
  const normalizedPath = changedFilePath.replace(/\\/g, "/").trim();
  if (!normalizedPath) {
    return undefined;
  }

  // Only screenshot when the story (Storybook test) file itself changed: a story
  // change is when intended behavior changed, which is what a screenshot should
  // validate. A change to a component (or any non-story file) is a potential
  // *regression* — caught by the always-run Storybook Tests job, not by emitting
  // a screenshot to eyeball. So a non-story change maps to no story.
  if (
    !normalizedPath.endsWith(".stories.tsx") &&
    !normalizedPath.endsWith(".stories.ts")
  ) {
    return undefined;
  }

  return existsSync(join(repoRoot, normalizedPath))
    ? normalizedPath
    : undefined;
}

function buildConfigYaml(screenshots) {
  if (screenshots.length === 0) {
    return "version: 1\nscreenshots: []\n";
  }

  const screenshotEntries = screenshots
    .map((screenshot) => {
      return [
        `  - name: "${screenshot.name}"`,
        `    url: "${STORYBOOK_BASE_URL}/?path=/story/${screenshot.storyId}"`,
      ].join("\n");
    })
    .join("\n");

  return [
    "version: 1",
    "screenshots:",
    screenshotEntries,
    "output:",
    "  branch: gh-screenshots",
    "  comment:",
    "    template: default",
    "",
  ].join("\n");
}

function appendGithubOutput(githubOutputPath, screenshotCount) {
  if (!githubOutputPath) {
    return;
  }

  const hasStories = screenshotCount > 0 ? "true" : "false";
  const output = `story_count=${screenshotCount}\nhas_stories=${hasStories}\n`;
  try {
    writeFileSync(githubOutputPath, output, { flag: "a" });
  } catch (error) {
    throw new Error(
      `Failed to write GitHub Action outputs to ${githubOutputPath}. Check that the output file path exists and is writable.`,
      { cause: error },
    );
  }
}

function readChangedFiles(repoRoot, changedFilesPath) {
  try {
    return readFileSync(join(repoRoot, changedFilesPath), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch (error) {
    throw new Error(
      `Failed to read changed files list from ${changedFilesPath}. Ensure the file exists and contains one file path per line.`,
      { cause: error },
    );
  }
}

function main() {
  const repoRoot = process.cwd();
  const { changedFilesPath, githubOutputPath, outputPath } = parseArgs(
    process.argv.slice(2),
  );

  const changedFiles = readChangedFiles(repoRoot, changedFilesPath);

  const storyFiles = new Set();
  for (const changedFilePath of changedFiles) {
    const storyFile = resolveStoryFileForChangedFile(repoRoot, changedFilePath);
    if (storyFile) {
      storyFiles.add(storyFile);
    }
  }

  const screenshotConfigs = Array.from(storyFiles)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((storyFile) => {
      const storyFilePath = join(repoRoot, storyFile);
      let details;
      try {
        details = parseStoryFile(storyFilePath);
      } catch (error) {
        throw new Error(
          `Failed to parse Storybook story file at ${storyFile}. Check the file syntax and Storybook metadata exports.`,
          { cause: error },
        );
      }
      return details.map((detail) => ({
        ...detail,
        storyFile,
      }));
    })
    .sort((a, b) => {
      const byComponent = a.componentName.localeCompare(b.componentName);
      if (byComponent !== 0) {
        return byComponent;
      }

      return a.storyExportName.localeCompare(b.storyExportName);
    });

  const outputAbsolutePath = join(repoRoot, outputPath);
  mkdirSync(dirname(outputAbsolutePath), { recursive: true });
  writeFileSync(outputAbsolutePath, buildConfigYaml(screenshotConfigs));

  appendGithubOutput(githubOutputPath, screenshotConfigs.length);

  const configPathForLog = relative(repoRoot, outputAbsolutePath);
  console.log(
    `Generated ${configPathForLog} with ${screenshotConfigs.length} screenshot(s).`,
  );
}

main();
