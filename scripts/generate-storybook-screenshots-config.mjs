#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import ts from "typescript";

const DEFAULT_OUTPUT_PATH = ".github/screenshots.dynamic.yml";
const STORYBOOK_BASE_URL = "http://127.0.0.1:6006";
const UNKNOWN_COMPONENT_NAME = "UnknownComponent";

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

function toKebabCase(value) {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getNamedStringProperty(objectLiteral, propertyName) {
  for (const property of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    if (
      !ts.isIdentifier(property.name) ||
      property.name.text !== propertyName
    ) {
      continue;
    }

    const initializer = property.initializer;
    if (
      ts.isStringLiteral(initializer) ||
      ts.isNoSubstitutionTemplateLiteral(initializer)
    ) {
      return initializer.text;
    }
  }

  return undefined;
}

function hasModifier(node, kind) {
  return node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
}

function getDefaultExportObjectLiteral(sourceFile) {
  const objectLiteralsByIdentifier = new Map();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
        continue;
      }

      if (ts.isObjectLiteralExpression(declaration.initializer)) {
        objectLiteralsByIdentifier.set(
          declaration.name.text,
          declaration.initializer,
        );
      }

      if (
        ts.isSatisfiesExpression(declaration.initializer) &&
        ts.isObjectLiteralExpression(declaration.initializer.expression)
      ) {
        objectLiteralsByIdentifier.set(
          declaration.name.text,
          declaration.initializer.expression,
        );
      }
    }
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isExportAssignment(statement)) {
      continue;
    }

    if (ts.isObjectLiteralExpression(statement.expression)) {
      return statement.expression;
    }

    if (ts.isIdentifier(statement.expression)) {
      return objectLiteralsByIdentifier.get(statement.expression.text);
    }
  }

  return undefined;
}

function extractStoryExports(sourceFile) {
  const exports = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isVariableStatement(statement) &&
      hasModifier(statement, ts.SyntaxKind.ExportKeyword)
    ) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          exports.push(declaration.name.text);
        }
      }
      continue;
    }

    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement)) &&
      statement.name &&
      hasModifier(statement, ts.SyntaxKind.ExportKeyword)
    ) {
      exports.push(statement.name.text);
    }
  }

  return exports.filter((name) => !name.startsWith("__"));
}

function parseStoryFile(storyFilePath) {
  const storySource = readFileSync(storyFilePath, "utf8");
  const sourceFile = ts.createSourceFile(
    storyFilePath,
    storySource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const defaultExportObjectLiteral = getDefaultExportObjectLiteral(sourceFile);
  if (!defaultExportObjectLiteral) {
    return [];
  }

  const metaId = getNamedStringProperty(defaultExportObjectLiteral, "id");
  const metaTitle = getNamedStringProperty(defaultExportObjectLiteral, "title");
  const componentName =
    metaTitle?.split("/").at(-1) ?? metaId ?? UNKNOWN_COMPONENT_NAME;

  if (!metaId && !metaTitle) {
    return [];
  }

  const storyExports = extractStoryExports(sourceFile);

  return storyExports.map((storyExportName) => {
    const titlePart = metaId
      ? toKebabCase(metaId)
      : toKebabCase(metaTitle ?? "");
    const storyPart = toKebabCase(storyExportName);

    return {
      componentName,
      name: `${toKebabCase(componentName)}-${storyPart}`,
      storyExportName,
      storyId: `${titlePart}--${storyPart}`,
    };
  });
}

function resolveStoryFileForChangedFile(repoRoot, changedFilePath) {
  const normalizedPath = changedFilePath.replace(/\\/g, "/").trim();
  if (!normalizedPath) {
    return undefined;
  }

  const absolutePath = join(repoRoot, normalizedPath);

  if (
    normalizedPath.endsWith(".stories.tsx") ||
    normalizedPath.endsWith(".stories.ts")
  ) {
    return existsSync(absolutePath) ? normalizedPath : undefined;
  }

  if (!/\.(tsx?|jsx?)$/.test(normalizedPath)) {
    return undefined;
  }

  if (
    normalizedPath.endsWith(".spec.ts") ||
    normalizedPath.endsWith(".spec.tsx")
  ) {
    return undefined;
  }

  const withoutExtension = normalizedPath.replace(/\.[^.]+$/, "");
  const storyCandidates = [
    `${withoutExtension}.stories.tsx`,
    `${withoutExtension}.stories.ts`,
  ];

  for (const candidate of storyCandidates) {
    if (existsSync(join(repoRoot, candidate))) {
      return candidate;
    }
  }

  return undefined;
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
  writeFileSync(githubOutputPath, output, { flag: "a" });
}

function main() {
  const repoRoot = process.cwd();
  const { changedFilesPath, githubOutputPath, outputPath } = parseArgs(
    process.argv.slice(2),
  );

  const changedFiles = readFileSync(join(repoRoot, changedFilesPath), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const storyFiles = new Set();
  for (const changedFilePath of changedFiles) {
    const storyFile = resolveStoryFileForChangedFile(repoRoot, changedFilePath);
    if (storyFile) {
      storyFiles.add(storyFile);
    }
  }

  const screenshots = Array.from(storyFiles)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((storyFile) => {
      const details = parseStoryFile(join(repoRoot, storyFile));
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
  writeFileSync(outputAbsolutePath, buildConfigYaml(screenshots));

  appendGithubOutput(githubOutputPath, screenshots.length);

  const configPathForLog = relative(repoRoot, outputAbsolutePath);
  console.log(
    `Generated ${configPathForLog} with ${screenshots.length} screenshot(s).`,
  );
}

main();
