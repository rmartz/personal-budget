import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { GOAL_CARD_COPY, GOALS_LIST_COPY } from "./copy";
import { GoalProgressBar } from "./GoalProgressBar";

afterEach(cleanup);

describe("GoalProgressBar — funded amount", () => {
  it("shows the funded amount formatted as currency", () => {
    render(<GoalProgressBar fundedAmount={2500} targetAmount={10000} />);
    expect(screen.getByText("$2,500.00")).toBeDefined();
  });

  it("shows the target amount via the ofTarget copy", () => {
    render(<GoalProgressBar fundedAmount={1000} targetAmount={8000} />);
    expect(
      screen.getByText(GOAL_CARD_COPY.ofTarget("$8,000.00")),
    ).toBeDefined();
  });
});

describe("GoalProgressBar — percent funded", () => {
  it("shows the funded percentage via the fundedLabel copy", () => {
    render(<GoalProgressBar fundedAmount={1000} targetAmount={4000} />);
    expect(screen.getByText(GOAL_CARD_COPY.fundedLabel(25))).toBeDefined();
  });

  it("shows 0% funded when targetAmount is 0", () => {
    render(<GoalProgressBar fundedAmount={0} targetAmount={0} />);
    expect(screen.getByText(GOAL_CARD_COPY.fundedLabel(0))).toBeDefined();
  });

  it("caps at 99% when not yet fully funded", () => {
    render(<GoalProgressBar fundedAmount={9999} targetAmount={10000} />);
    expect(screen.getByText(GOAL_CARD_COPY.fundedLabel(99))).toBeDefined();
  });

  it("shows 100% when fully funded", () => {
    render(<GoalProgressBar fundedAmount={5000} targetAmount={5000} />);
    expect(screen.getByText(GOAL_CARD_COPY.fundedLabel(100))).toBeDefined();
  });
});

describe("GoalProgressBar — amount remaining", () => {
  it("shows amount to go when not fully funded", () => {
    render(<GoalProgressBar fundedAmount={1000} targetAmount={5000} />);
    expect(
      screen.getByText(GOAL_CARD_COPY.toGoLabel("$4,000.00")),
    ).toBeDefined();
  });

  it("does not show the to-go label when fully funded", () => {
    render(<GoalProgressBar fundedAmount={5000} targetAmount={5000} />);
    expect(screen.queryByText(/to go/)).toBeNull();
  });
});

describe("GoalProgressBar — fully funded indicator", () => {
  it("shows the ready-to-purchase label when fundedAmount equals targetAmount", () => {
    render(<GoalProgressBar fundedAmount={3000} targetAmount={3000} />);
    expect(screen.getByText(GOALS_LIST_COPY.readyToPurchase)).toBeDefined();
  });

  it("shows the ready-to-purchase label when fundedAmount exceeds targetAmount", () => {
    render(<GoalProgressBar fundedAmount={4000} targetAmount={3000} />);
    expect(screen.getByText(GOALS_LIST_COPY.readyToPurchase)).toBeDefined();
  });

  it("does not show ready-to-purchase label when not fully funded", () => {
    render(<GoalProgressBar fundedAmount={2999} targetAmount={3000} />);
    expect(screen.queryByText(GOALS_LIST_COPY.readyToPurchase)).toBeNull();
  });
});
