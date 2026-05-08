import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NewSavingsGoalDialogView } from "../NewSavingsGoalDialog";
import { NEW_SAVINGS_GOAL_DIALOG_COPY } from "../NewSavingsGoalDialog.copy";

afterEach(cleanup);

function renderView(
  overrides: Partial<Parameters<typeof NewSavingsGoalDialogView>[0]> = {},
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    name: "",
    onNameChange: vi.fn(),
    targetAmount: "",
    onTargetAmountChange: vi.fn(),
    nameError: undefined,
    targetAmountError: undefined,
    submitError: undefined,
    onSubmit: vi.fn(),
    isSubmitting: false,
    ...overrides,
  };
  render(<NewSavingsGoalDialogView {...props} />);
  return props;
}

describe("NewSavingsGoalDialogView", () => {
  describe("A 'New goal' action opens a creation dialog", () => {
    it("renders the dialog title when open", () => {
      renderView();
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.title),
      ).toBeDefined();
    });
  });

  describe("Form fields: name (required), target amount (required, positive number)", () => {
    it("renders the name label", () => {
      renderView();
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
      ).toBeDefined();
    });

    it("renders the target amount label", () => {
      renderView();
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
      ).toBeDefined();
    });

    it("renders the submit button", () => {
      renderView();
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the cancel button", () => {
      renderView();
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });
  });

  describe("Validation: name must be non-empty; target must be a positive number", () => {
    it("renders the name error message when nameError is provided", () => {
      renderView({ nameError: NEW_SAVINGS_GOAL_DIALOG_COPY.nameError });
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameError),
      ).toBeDefined();
    });

    it("renders the target amount error message when targetAmountError is provided", () => {
      renderView({
        targetAmountError: NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError,
      });
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError),
      ).toBeDefined();
    });

    it("renders the submit error message when submitError is provided", () => {
      renderView({ submitError: NEW_SAVINGS_GOAL_DIALOG_COPY.submitError });
      expect(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.submitError),
      ).toBeDefined();
    });

    it("does not render name error when nameError is undefined", () => {
      renderView({ nameError: undefined });
      expect(
        screen.queryByText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameError),
      ).toBeNull();
    });

    it("does not render target amount error when targetAmountError is undefined", () => {
      renderView({ targetAmountError: undefined });
      expect(
        screen.queryByText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError),
      ).toBeNull();
    });

    it("does not render submit error when submitError is undefined", () => {
      renderView({ submitError: undefined });
      expect(
        screen.queryByText(NEW_SAVINGS_GOAL_DIALOG_COPY.submitError),
      ).toBeNull();
    });
  });

  describe("All user-facing strings in a co-located copy file", () => {
    it("calls onSubmit when the form is submitted", () => {
      const onSubmit = vi.fn();
      renderView({ onSubmit });
      fireEvent.submit(document.querySelector("form")!);
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("calls onNameChange when the name input changes", () => {
      const onNameChange = vi.fn();
      renderView({ onNameChange });
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "Emergency Fund" } },
      );
      expect(onNameChange).toHaveBeenCalledWith("Emergency Fund");
    });

    it("calls onTargetAmountChange when the target amount input changes", () => {
      const onTargetAmountChange = vi.fn();
      renderView({ onTargetAmountChange });
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "5000" } },
      );
      expect(onTargetAmountChange).toHaveBeenCalledWith("5000");
    });

    it("disables the submit button while submitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.submitButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });

    it("disables the cancel button while submitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.cancelButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });
  });
});
