import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SCRIPT_PATH = join(process.cwd(), "scripts", "validate-config.mjs");
const SCRIPT_SOURCE = readFileSync(SCRIPT_PATH, "utf8");
const TEST_APP_NAME = "Personal Budget";
const SCHEMA_SOURCE = `allowed_patterns:
  - NEXT_PUBLIC_*
allowed_keys:
  - PUBLIC_APP_URL
denied_patterns:
  - *SECRET*
`;

interface ValidateConfigIntegrationTestResult {
  stderr: string;
  status: number | null;
  stdout: string;
}

function makeValidateConfigInTempRepo(options: {
  envArg?: string;
  environmentsYml: string;
  stagingYml: string;
}): ValidateConfigIntegrationTestResult {
  const tempRoot = mkdtempSync(join(tmpdir(), "validate-config-"));
  const scriptsDir = join(tempRoot, "scripts");
  const deploymentDir = join(tempRoot, "deployment");

  mkdirSync(scriptsDir, { recursive: true });
  mkdirSync(deploymentDir, { recursive: true });

  writeFileSync(join(scriptsDir, "validate-config.mjs"), SCRIPT_SOURCE);
  writeFileSync(join(deploymentDir, "schema.yml"), SCHEMA_SOURCE);
  writeFileSync(
    join(deploymentDir, "environments.yml"),
    options.environmentsYml,
  );
  writeFileSync(join(deploymentDir, "staging.yml"), options.stagingYml);

  try {
    const args = [join(scriptsDir, "validate-config.mjs")];
    if (options.envArg) {
      args.push(`--env=${options.envArg}`);
    }
    const result = spawnSync("node", args, {
      encoding: "utf8",
      cwd: tempRoot,
    });
    return {
      stderr: result.stderr,
      status: result.status,
      stdout: result.stdout,
    };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

describe("validate-config script", () => {
  it("fails fast when no active environments are listed and --env is not provided", () => {
    const result = makeValidateConfigInTempRepo({
      environmentsYml: "single_environment: true\nactive:\n",
      stagingYml: `variables:\n  NEXT_PUBLIC_APP_NAME: ${TEST_APP_NAME}\n`,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "ERROR: environments.yml has no active environments listed.",
    );
  });

  it("allows explicit --env validation when active environments are empty", () => {
    const result = makeValidateConfigInTempRepo({
      envArg: "staging",
      environmentsYml: "single_environment: true\nactive:\n",
      stagingYml: `variables:\n  NEXT_PUBLIC_APP_NAME: ${TEST_APP_NAME}\n`,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("deployment/staging.yml — OK");
  });

  it("validates listed active environments when --env is not provided", () => {
    const result = makeValidateConfigInTempRepo({
      environmentsYml: "single_environment: true\nactive:\n  - staging\n",
      stagingYml: `variables:\n  NEXT_PUBLIC_APP_NAME: ${TEST_APP_NAME}\n`,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("deployment/staging.yml — OK");
  });
});
