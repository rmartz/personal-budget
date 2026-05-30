import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const STANDARD_TIMEOUT_MINUTES = 5;

const TIMEOUT_OVERRIDES: Record<string, Record<string, number>> = {
  "claude-code.yml": {
    claude: 30,
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

  it("discovers all five expected workflow files", () => {
    const fileNames = workflows.map((w) => w.fileName).sort();
    expect(fileNames).toEqual([
      "ci-actions.yml",
      "claude-code.yml",
      "pr-title-lint.yml",
      "secret-scan.yml",
      "sentry-release.yml",
    ]);
  });

  for (const workflow of workflows) {
    for (const [jobId, job] of Object.entries(workflow.jobs)) {
      // GitHub Actions does not allow timeout-minutes on jobs that call a
      // reusable workflow (jobs with `uses:` instead of `runs-on`/`steps`).
      // The reusable workflow controls its own timeout.
      if (job.uses !== undefined) {
        continue;
      }

      const expectedTimeout =
        TIMEOUT_OVERRIDES[workflow.fileName]?.[jobId] ??
        STANDARD_TIMEOUT_MINUTES;

      it(`${workflow.fileName} job "${jobId}" has timeout-minutes: ${expectedTimeout}`, () => {
        expect(job["timeout-minutes"]).toBe(expectedTimeout);
      });
    }
  }
});
