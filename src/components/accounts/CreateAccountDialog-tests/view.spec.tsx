import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { CreateAccountDialogView } from "../CreateAccountDialogView";
import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";
import { CREATE_ACCOUNT_DIALOG_COPY } from "../copy";

afterEach(cleanup);

function renderView(
  overrides: Partial<Parameters<typeof CreateAccountDialogView>[0]> = {},
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    name: "",
    onNameChange: vi.fn(),
    accountType: undefined as ReconciliationAccountTier | undefined,
    onAccountTypeChange: vi.fn(),
    targetFloat: "",
    onTargetFloatChange: vi.fn(),
    nameError: undefined,
    accountTypeError: undefined,
    targetFloatError: undefined,
    submitError: undefined,
    onSubmit: vi.fn(),
    isSubmitting: false,
    ...overrides,
  };
  render(<CreateAccountDialogView {...props} />);
  return props;
}

describe("CreateAccountDialogView", () => {
  describe("A 'New account' action opens a creation form", () => {
    it("renders the dialog title when open", () => {
      renderView({ open: true });
      expect(screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.title)).toBeDefined();
    });

    it("renders the cancel button", () => {
      renderView();
      expect(
        screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });

    it("renders the submit button", () => {
      renderView();
      expect(
        screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });
  });

  describe("All types require: name and type fields", () => {
    it("renders the name field", () => {
      renderView();
      expect(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
      ).toBeDefined();
    });

    it("renders the type selector", () => {
      renderView();
      expect(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
      ).toBeDefined();
    });

    it("shows name error when nameError is provided", () => {
      renderView({ nameError: CREATE_ACCOUNT_DIALOG_COPY.nameRequiredError });
      expect(
        screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.nameRequiredError),
      ).toBeDefined();
    });

    it("shows type error when accountTypeError is provided", () => {
      renderView({
        accountTypeError: CREATE_ACCOUNT_DIALOG_COPY.typeRequiredError,
      });
      expect(
        screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.typeRequiredError),
      ).toBeDefined();
    });

    it("does not show name error when nameError is undefined", () => {
      renderView({ nameError: undefined });
      expect(
        screen.queryByText(CREATE_ACCOUNT_DIALOG_COPY.nameRequiredError),
      ).toBeNull();
    });

    it("does not show type error when accountTypeError is undefined", () => {
      renderView({ accountTypeError: undefined });
      expect(
        screen.queryByText(CREATE_ACCOUNT_DIALOG_COPY.typeRequiredError),
      ).toBeNull();
    });
  });

  describe("Cash account types additionally require: target float", () => {
    it("renders the target float field for short-term type", () => {
      renderView({ accountType: ReconciliationAccountTier.ShortTerm });
      expect(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
      ).toBeDefined();
    });

    it("renders the target float field for reserve type", () => {
      renderView({ accountType: ReconciliationAccountTier.Reserve });
      expect(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
      ).toBeDefined();
    });

    it("renders the target float field for long-term type", () => {
      renderView({ accountType: ReconciliationAccountTier.LongTerm });
      expect(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
      ).toBeDefined();
    });

    it("shows target float error when targetFloatError is provided", () => {
      renderView({
        accountType: ReconciliationAccountTier.ShortTerm,
        targetFloatError: CREATE_ACCOUNT_DIALOG_COPY.targetFloatRequiredError,
      });
      expect(
        screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatRequiredError),
      ).toBeDefined();
    });

    it("does not show target float error when targetFloatError is undefined", () => {
      renderView({
        accountType: ReconciliationAccountTier.ShortTerm,
        targetFloatError: undefined,
      });
      expect(
        screen.queryByText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatRequiredError),
      ).toBeNull();
    });
  });

  describe("Investment accounts have no float field", () => {
    it("does not render the target float field for investment type", () => {
      renderView({ accountType: ReconciliationAccountTier.Investment });
      expect(
        screen.queryByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
      ).toBeNull();
    });

    it("does not render the target float field when no type is selected", () => {
      renderView({ accountType: undefined });
      expect(
        screen.queryByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
      ).toBeNull();
    });
  });

  describe("Submitting calls onSubmit", () => {
    it("calls onSubmit when the form is submitted", () => {
      const onSubmit = vi.fn();
      renderView({ onSubmit });
      fireEvent.submit(document.querySelector("form")!);
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("disables the submit button while isSubmitting is true", () => {
      renderView({ isSubmitting: true });
      const btn = screen
        .getByText(CREATE_ACCOUNT_DIALOG_COPY.submitButton)
        .closest("button");
      expect(btn?.disabled).toBe(true);
    });

    it("disables the cancel button while isSubmitting is true", () => {
      renderView({ isSubmitting: true });
      const btn = screen
        .getByText(CREATE_ACCOUNT_DIALOG_COPY.cancelButton)
        .closest("button");
      expect(btn?.disabled).toBe(true);
    });

    it("shows submit error when submitError is provided", () => {
      renderView({ submitError: CREATE_ACCOUNT_DIALOG_COPY.submitError });
      expect(
        screen.getByText(CREATE_ACCOUNT_DIALOG_COPY.submitError),
      ).toBeDefined();
    });

    it("does not show submit error when submitError is undefined", () => {
      renderView({ submitError: undefined });
      expect(
        screen.queryByText(CREATE_ACCOUNT_DIALOG_COPY.submitError),
      ).toBeNull();
    });
  });

  describe("interactions", () => {
    it("calls onNameChange when the name input changes", () => {
      const onNameChange = vi.fn();
      renderView({ onNameChange });
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.nameLabel),
        { target: { value: "Chase Checking" } },
      );
      expect(onNameChange).toHaveBeenCalledWith("Chase Checking");
    });

    it("calls onAccountTypeChange when the type selector changes", () => {
      const onAccountTypeChange = vi.fn();
      renderView({ onAccountTypeChange });
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.typeLabel),
        { target: { value: ReconciliationAccountTier.ShortTerm } },
      );
      expect(onAccountTypeChange).toHaveBeenCalledWith(
        ReconciliationAccountTier.ShortTerm,
      );
    });

    it("calls onTargetFloatChange when the target float input changes", () => {
      const onTargetFloatChange = vi.fn();
      renderView({
        accountType: ReconciliationAccountTier.Reserve,
        onTargetFloatChange,
      });
      fireEvent.change(
        screen.getByLabelText(CREATE_ACCOUNT_DIALOG_COPY.targetFloatLabel),
        { target: { value: "5000" } },
      );
      expect(onTargetFloatChange).toHaveBeenCalledWith("5000");
    });
  });
});
