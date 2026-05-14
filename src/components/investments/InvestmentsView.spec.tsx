import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { InvestmentsView } from "./InvestmentsView";
import { Posture } from "@/lib/firebase/schema/investments";
import { INVESTMENTS_VIEW_COPY, POSTURE_CARD_COPY } from "./copy";

afterEach(cleanup);

const baseProps = {
  accounts: [],
  allocation: [],
  posture: Posture.Balanced,
  isLoading: false,
  onApplyRebalance: vi.fn(),
};

describe("InvestmentsView — title", () => {
  it("renders the Investments heading", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(INVESTMENTS_VIEW_COPY.title)).toBeDefined();
  });
});

describe("InvestmentsView — top cards", () => {
  it("renders the Recommended this month card", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(/Recommended this month/)).toBeDefined();
  });

  it("renders the Posture card", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(POSTURE_CARD_COPY.title)).toBeDefined();
  });

  it("renders the Aggregate buy / sell card", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(/Aggregate buy \/ sell/)).toBeDefined();
  });
});

describe("InvestmentsView — middle section", () => {
  it("renders the Target allocation section", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(/Target allocation/)).toBeDefined();
  });

  it("renders the monthly distribution section", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(/This month's distribution/)).toBeDefined();
  });
});

describe("InvestmentsView — ledger table", () => {
  it("renders the per-ledger investment portion section", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(/Per-ledger investment portion/)).toBeDefined();
  });
});

describe("InvestmentsView — no runtime errors with empty data", () => {
  it("renders without crashing when all data arrays are empty", () => {
    render(<InvestmentsView {...baseProps} />);
    expect(screen.getByText(INVESTMENTS_VIEW_COPY.title)).toBeDefined();
  });
});
