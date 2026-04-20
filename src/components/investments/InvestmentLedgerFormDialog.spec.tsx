import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { InvestmentLedgerFormDialog } from "./InvestmentLedgerFormDialog";
import { INVESTMENT_LEDGER_FORM_DIALOG_COPY } from "./copy";
import type { InvestmentLedger } from "@/lib/types";

afterEach(cleanup);

function makeInvestmentLedger(
  overrides: Partial<InvestmentLedger> = {},
): InvestmentLedger {
  return {
    id: "test-id",
    name: "Test Ledger",
    currentBalance: 0,
    ...overrides,
  };
}

describe("InvestmentLedgerFormDialog", () => {
  describe("create mode", () => {
    it("renders the create title when no ledger is provided", () => {
      const { getByText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.createTitle),
      ).toBeDefined();
    });

    it("renders the submit button with the create label", () => {
      const { getByText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.submitCreate),
      ).toBeDefined();
    });

    it("calls onSubmit with the entered name when submitted", () => {
      const onSubmit = vi.fn();
      const { getByLabelText, getByText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        getByLabelText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.nameLabel),
        { target: { value: "My New Ledger" } },
      );
      fireEvent.click(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.submitCreate),
      );
      expect(onSubmit).toHaveBeenCalledWith({ name: "My New Ledger" });
    });

    it("shows a validation error when submitting with an empty name", () => {
      const onSubmit = vi.fn();
      const { getByText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.click(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.submitCreate),
      );
      expect(onSubmit).not.toHaveBeenCalled();
      expect(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.nameRequiredError),
      ).toBeDefined();
    });
  });

  describe("edit mode", () => {
    it("renders the edit title when a ledger is provided", () => {
      const ledger = makeInvestmentLedger({ name: "Bonds" });
      const { getByText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          ledger={ledger}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.editTitle),
      ).toBeDefined();
    });

    it("pre-populates the name field with the ledger name", () => {
      const ledger = makeInvestmentLedger({ name: "Bonds" });
      const { getByLabelText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          ledger={ledger}
          onSubmit={vi.fn()}
        />,
      );
      const input = getByLabelText(
        INVESTMENT_LEDGER_FORM_DIALOG_COPY.nameLabel,
      ) as HTMLInputElement;
      expect(input.value).toBe("Bonds");
    });

    it("renders the submit button with the edit label", () => {
      const ledger = makeInvestmentLedger({ name: "Bonds" });
      const { getByText } = render(
        <InvestmentLedgerFormDialog
          open={true}
          onOpenChange={vi.fn()}
          ledger={ledger}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        getByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.submitEdit),
      ).toBeDefined();
    });
  });

  describe("when closed", () => {
    it("renders nothing when open is false", () => {
      const { queryByText } = render(
        <InvestmentLedgerFormDialog
          open={false}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        queryByText(INVESTMENT_LEDGER_FORM_DIALOG_COPY.createTitle),
      ).toBeNull();
    });
  });
});
