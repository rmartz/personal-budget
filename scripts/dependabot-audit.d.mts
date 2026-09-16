export interface StatusCheck {
  conclusion?: string;
  state?: string;
}

export interface DependabotPr {
  number: number;
  title: string;
  state: string;
  statusCheckRollup?: StatusCheck[];
}

export interface OtherPr {
  number: number;
  title: string;
  state: string;
  body?: string;
  author?: { login: string };
}

export interface Row {
  number: number;
  title: string;
  group: string;
  outcome: string;
  fixes: number[];
  mechanics: boolean;
}

export interface Bucket {
  clean: number;
  "needed-fix": number;
  mechanics: number;
  stuck: number;
  pending: number;
  churn: number;
}

export interface Report {
  rows: Row[];
  groups: Map<string, Bucket>;
}

export function buildReport(
  dependabotPrs: DependabotPr[],
  otherPrs: OtherPr[],
): Report;
