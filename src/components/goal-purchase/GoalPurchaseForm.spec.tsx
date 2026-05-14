import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { GoalPurchaseForm } from "./GoalPurchaseForm";
import { GOAL_PURCHASE_FORM_COPY } from "./copy";

afterEach(cleanup);

describe("GoalPurchaseForm — fields", () => {
  describe("renders the amount field", () => {
    it("shows the amount label", () => {
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(GOAL_PURCHASE_FORM_COPY.amountLabel),
      ).toBeDefined();
    });
  });

  describe("renders the date field", () => {
    it("shows the date label", () => {
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(GOAL_PURCHASE_FORM_COPY.dateLabel)).toBeDefined();
    });
  });

  describe("renders the note field", () => {
    it("shows the note label", () => {
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(GOAL_PURCHASE_FORM_COPY.noteLabel)).toBeDefined();
    });
  });

  describe("renders the expense note", () => {
    it("shows the ledger name in the expense note", () => {
      render(
        <GoalPurchaseForm
          ledgerName="Travel Fund"
          targetAmount={5000}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(GOAL_PURCHASE_FORM_COPY.expenseNote("Travel Fund")),
      ).toBeDefined();
    });
  });
});

describe("GoalPurchaseForm — actions", () => {
  describe("Cancel button links to /goals", () => {
    it("renders a Cancel link pointing to /goals", () => {
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={vi.fn()}
        />,
      );
      const cancelLink = screen.getByRole("link", {
        name: GOAL_PURCHASE_FORM_COPY.cancelButton,
      });
      expect(cancelLink.getAttribute("href")).toBe("/goals");
    });
  });

  describe("Mark purchased button calls onSubmit", () => {
    it("calls onSubmit when the submit button is clicked", () => {
      const onSubmit = vi.fn();
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: GOAL_PURCHASE_FORM_COPY.submitButton,
        }),
      );
      expect(onSubmit).toHaveBeenCalledOnce();
    });
  });
});
