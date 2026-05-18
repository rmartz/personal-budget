import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  LEDGER_INVESTMENT_TABLE_COPY,
  MONTHLY_AGGREGATION_SUMMARY_COPY,
} from "./copy";
import { MonthlyAggregationSummaryView } from "./MonthlyAggregationSummaryView";

afterEach(cleanup);

const baseRows = [
  {
    cashBalance: 4200,
    investmentBalance: 12000,
    ledgerName: "Primary",
    netBuySell: 800,
  },
  {
    cashBalance: 1600,
    investmentBalance: 8400,
    ledgerName: "Travel Fund",
    netBuySell: -360,
  },
];

describe("MonthlyAggregationSummaryView — column headers", () => {
  it("renders the Ledger column header", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(
      screen.getByText(LEDGER_INVESTMENT_TABLE_COPY.columnLedger),
    ).toBeDefined();
  });

  it("renders the Cash column header", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(
      screen.getByText(LEDGER_INVESTMENT_TABLE_COPY.columnCash),
    ).toBeDefined();
  });

  it("renders the Invested column header", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(
      screen.getByText(LEDGER_INVESTMENT_TABLE_COPY.columnInvested),
    ).toBeDefined();
  });

  it("renders the Net buy / sell column header", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(
      screen.getByText(LEDGER_INVESTMENT_TABLE_COPY.columnNetBuySell),
    ).toBeDefined();
  });
});

describe("MonthlyAggregationSummaryView — row data", () => {
  it("renders a ledger name", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(screen.getByText("Primary")).toBeDefined();
  });

  it("renders the cash balance formatted as currency", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(screen.getByText("$4,200.00")).toBeDefined();
  });

  it("renders the investment balance formatted as currency", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(screen.getByText("$12,000.00")).toBeDefined();
  });

  it("renders a positive net buy/sell formatted as currency", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(screen.getByText("$800.00")).toBeDefined();
  });

  it("renders a negative net buy/sell formatted as currency", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={2} />,
    );
    expect(screen.getByText("-$360.00")).toBeDefined();
  });
});

describe("MonthlyAggregationSummaryView — view all link", () => {
  it("renders the view all link with total ledger count", () => {
    render(
      <MonthlyAggregationSummaryView rows={baseRows} totalLedgerCount={14} />,
    );
    expect(
      screen.getByText(LEDGER_INVESTMENT_TABLE_COPY.viewAllLink(14)),
    ).toBeDefined();
  });
});

describe("MonthlyAggregationSummaryView — empty state", () => {
  it("renders the empty state message when rows is empty", () => {
    render(<MonthlyAggregationSummaryView rows={[]} totalLedgerCount={0} />);
    expect(
      screen.getByText(MONTHLY_AGGREGATION_SUMMARY_COPY.noLedgerData),
    ).toBeDefined();
  });

  it("does not render table headers when rows is empty", () => {
    render(<MonthlyAggregationSummaryView rows={[]} totalLedgerCount={0} />);
    expect(
      screen.queryByText(LEDGER_INVESTMENT_TABLE_COPY.columnLedger),
    ).toBeNull();
  });
});
