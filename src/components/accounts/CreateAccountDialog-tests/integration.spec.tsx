import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { CreateAccountDialog } from "../CreateAccountDialog";
import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { CREATE_ACCOUNT_DIALOG_COPY } from "../copy";

afterEach(cleanup);

describe("CreateAccountDialog integration", () => {
  describe("Submitting persists the account via the service layer", () => {
    it("calls onSubmit with name, type, and targetFloat for a cash account", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "My Savings" } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.Reserve } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
        { target: { value: "5000" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: "My Savings",
          type: ReconciliationAccountTier.Reserve,
          targetFloat: 5000,
        });
      });
    });

    it("calls onSubmit with name and type (no targetFloat) for investment account", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Brokerage" } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.Investment } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: "Brokerage",
          type: ReconciliationAccountTier.Investment,
          targetFloat: undefined,
        });
      });
    });

    it("shows name error and does not call onSubmit when name is empty", async () => {
      const onSubmit = vi.fn();
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.ShortTerm } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
        { target: { value: "1000" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.nameRequiredError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows type error and does not call onSubmit when type is not selected", async () => {
      const onSubmit = vi.fn();
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Checking" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.typeRequiredError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows target float error when submitting a cash account with no float", async () => {
      const onSubmit = vi.fn();
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Checking" } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.ShortTerm } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatRequiredError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows target float error when submitting with a non-positive float", async () => {
      const onSubmit = vi.fn();
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Checking" } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.LongTerm } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
        { target: { value: "-500" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatInvalidError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows submit error when onSubmit rejects", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Checking" } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.Investment } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
    });

    it("calls onOpenChange with false after successful submission", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onOpenChange = vi.fn();
      render(
        <CreateAccountDialog
          open={true}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Brokerage" } },
      );
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.Investment } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
