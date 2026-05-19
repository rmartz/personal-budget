import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GOAL_PURCHASE_FORM_COPY } from "./copy";
import { GoalPurchaseForm } from "./GoalPurchaseForm";

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
    it("calls onSubmit when the submit button is clicked", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
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
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalledOnce();
      });
    });

    it("passes the entered amount to onSubmit", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(GOAL_PURCHASE_FORM_COPY.amountLabel),
        { target: { value: "1250.50" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: GOAL_PURCHASE_FORM_COPY.submitButton,
        }),
      );
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalledOnce();
      });
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 1250.5 }),
      );
    });

    it("does not call onSubmit when amount is cleared", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(GOAL_PURCHASE_FORM_COPY.amountLabel),
        { target: { value: "" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: GOAL_PURCHASE_FORM_COPY.submitButton,
        }),
      );
      await vi.waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it("passes the entered description to onSubmit", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(GOAL_PURCHASE_FORM_COPY.noteLabel),
        { target: { value: "Studio Display refurb" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: GOAL_PURCHASE_FORM_COPY.submitButton,
        }),
      );
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalledOnce();
      });
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Studio Display refurb" }),
      );
    });

    it("passes a Date object for the purchase date to onSubmit", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
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
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalledOnce();
      });
      const callArg = (vi.mocked(onSubmit).mock.calls[0] ?? [])[0] as {
        date: unknown;
      };
      expect(callArg.date).toBeInstanceOf(Date);
    });

    it("shows an error message when onSubmit rejects", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("network error"));
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
      await vi.waitFor(() => {
        expect(
          screen.getByText(GOAL_PURCHASE_FORM_COPY.submitError),
        ).toBeDefined();
      });
    });

    it("re-enables the submit button after onSubmit resolves", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <GoalPurchaseForm
          ledgerName="Primary"
          targetAmount={5000}
          onSubmit={onSubmit}
        />,
      );
      const button = screen.getByRole("button", {
        name: GOAL_PURCHASE_FORM_COPY.submitButton,
      });
      fireEvent.click(button);
      await vi.waitFor(() => {
        expect((button as HTMLButtonElement).disabled).toBe(false);
      });
    });
  });
});
