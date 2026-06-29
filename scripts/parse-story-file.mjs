import { readFileSync } from "node:fs";

import ts from "typescript";

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

export function parseStoryFile(storyFilePath) {
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
  if (!metaId && !metaTitle) {
    return [];
  }

  const componentName = metaTitle?.split("/").filter(Boolean).at(-1) || metaId;
  const titleBase = metaId ?? metaTitle;
  const storyExports = extractStoryExports(sourceFile);

  return storyExports.map((storyExportName) => {
    const titlePart = toKebabCase(titleBase);
    const storyPart = toKebabCase(storyExportName);

    return {
      componentName,
      name: `${toKebabCase(componentName)}-${storyPart}`,
      storyExportName,
      storyId: `${titlePart}--${storyPart}`,
    };
  });
}
