import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

// Per-job timeout caps in minutes. Values are tuned from observed p95 + 1.5–2×
// headroom so a hung job fails quickly while normal slow runs still complete.
// Adding a new job to any workflow requires adding an entry here — the test
// asserts every non-reusable-workflow caller job has an explicit expected cap.
const EXPECTED_TIMEOUT_MINUTES: Record<string, Record<string, number>> = {
  "ci-actions.yml": {
    build: 2,
    "detect-changes": 1,
    format: 2,
    lint: 2,
    "storybook-build": 2,
    "storybook-screenshots": 3,
    "storybook-tests": 4,
    tests: 2,
    "type-check": 2,
  },
  "file-length.yml": {
    check: 2,
  },
  "package-pins.yml": {
    "check-package-pins": 1,
    "detect-changes": 1,
  },
  "pr-title-lint.yml": {
    "pr-title": 1,
  },
  "sentry-release.yml": {
    "create-release": 2,
  },
  "validate-config.yml": {
    "validate-config": 2,
  },
};

const workflowsDir = resolve(import.meta.dirname, "../.github/workflows");

interface WorkflowJob {
  "timeout-minutes"?: number;
  uses?: string;
  "runs-on"?: string;
}

interface WorkflowFile {
  fileName: string;
  jobs: Record<string, WorkflowJob>;
}

function loadWorkflows(): WorkflowFile[] {
  const fileNames = readdirSync(workflowsDir).filter(
    (name) => name.endsWith(".yml") || name.endsWith(".yaml"),
  );
  return fileNames.map((fileName) => {
    const raw = readFileSync(resolve(workflowsDir, fileName), "utf-8");
    const parsed = parse(raw) as { jobs: WorkflowFile["jobs"] };
    return { fileName, jobs: parsed.jobs };
  });
}

describe("GitHub Actions workflow timeouts", () => {
  const workflows = loadWorkflows();

  it("only contains workflows registered in EXPECTED_TIMEOUT_MINUTES", () => {
    const onDisk = workflows.map((w) => w.fileName).sort();
    const registered = Object.keys(EXPECTED_TIMEOUT_MINUTES).sort();
    expect(onDisk).toEqual(registered);
  });

  for (const workflow of workflows) {
    for (const [jobId, job] of Object.entries(workflow.jobs)) {
      // GitHub Actions does not allow timeout-minutes on jobs that call a
      // reusable workflow (jobs with `uses:` instead of `runs-on`/`steps`).
      // The reusable workflow controls its own timeout.
      if (job.uses !== undefined) {
        expect(job["timeout-minutes"]).toBeUndefined();
        continue;
      }

      const expected = EXPECTED_TIMEOUT_MINUTES[workflow.fileName]?.[jobId];

      it(`${workflow.fileName} job "${jobId}" has a registered expected timeout`, () => {
        expect(expected).toBeDefined();
      });

      if (expected === undefined) {
        continue;
      }

      it(`${workflow.fileName} job "${jobId}" has timeout-minutes: ${expected}`, () => {
        expect(job["timeout-minutes"]).toBe(expected);
      });
    }
  }
});
