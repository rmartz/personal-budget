import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { EditSavingsGoalDialog } from "./EditSavingsGoalDialog";
import { EDIT_SAVINGS_GOAL_DIALOG_COPY } from "./copy";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

afterEach(cleanup);

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "Emergency Fund",
    targetAmount: 5000,
    fundedAmount: 1000,
    priority: 1,
    ...overrides,
  };
}

function renderDialog(
  overrides: Partial<Parameters<typeof EditSavingsGoalDialog>[0]> = {},
) {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const goal = makeGoal();
  const props = {
    goal,
    onSave,
    ...overrides,
  };
  const result = render(<EditSavingsGoalDialog {...props} />);
  return { ...result, onSave, goal };
}

function openDialog(goalName = "Emergency Fund") {
  const trigger = screen.getByRole("button", {
    name: `${EDIT_SAVINGS_GOAL_DIALOG_COPY.editButton} ${goalName}`,
  });
  fireEvent.click(trigger);
}

describe("EditSavingsGoalDialog", () => {
  describe("An edit action on each goal row opens a pre-populated edit dialog", () => {
    it("renders an edit button with accessible name including the goal name", () => {
      renderDialog({ goal: makeGoal({ name: "Vacation Fund" }) });
      expect(
        screen.getByRole("button", {
          name: `${EDIT_SAVINGS_GOAL_DIALOG_COPY.editButton} Vacation Fund`,
        }),
      ).toBeDefined();
    });

    it("shows the dialog title after clicking the edit button", () => {
      renderDialog();
      openDialog();
      expect(
        screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.dialogTitle),
      ).toBeDefined();
    });

    it("pre-populates the name field with the goal name", () => {
      renderDialog({ goal: makeGoal({ name: "Car Fund" }) });
      openDialog("Car Fund");
      const nameInput = screen.getByLabelText(
        EDIT_SAVINGS_GOAL_DIALOG_COPY.nameLabel,
      );
      expect((nameInput as HTMLInputElement).value).toBe("Car Fund");
    });

    it("pre-populates the target amount field with the goal target amount", () => {
      renderDialog({ goal: makeGoal({ targetAmount: 3500 }) });
      openDialog();
      const targetInput = screen.getByLabelText(
        EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel,
      );
      expect((targetInput as HTMLInputElement).value).toBe("3500");
    });
  });

  describe("Editable fields: name, target amount", () => {
    it("calls onSave with updated name on valid submit", async () => {
      const { onSave, goal } = renderDialog({
        goal: makeGoal({ name: "Old Name" }),
      });
      openDialog("Old Name");
      const nameInput = screen.getByLabelText(
        EDIT_SAVINGS_GOAL_DIALOG_COPY.nameLabel,
      );
      fireEvent.change(nameInput, { target: { value: "New Name" } });
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(goal.id, {
          name: "New Name",
          targetAmount: goal.targetAmount,
        });
      });
    });

    it("calls onSave with updated target amount on valid submit", async () => {
      const { onSave, goal } = renderDialog();
      openDialog();
      const targetInput = screen.getByLabelText(
        EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel,
      );
      fireEvent.change(targetInput, { target: { value: "7500" } });
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(goal.id, {
          name: goal.name,
          targetAmount: 7500,
        });
      });
    });

    it("does not call onSave when name is empty", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.change(
        screen.getByLabelText(EDIT_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
      expect(
        screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.nameRequired),
      ).toBeDefined();
    });

    it("does not call onSave when target amount is zero or negative", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.change(
        screen.getByLabelText(EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "-100" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
      expect(
        screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountInvalid),
      ).toBeDefined();
    });

    it("does not call onSave when target amount is empty", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.change(
        screen.getByLabelText(EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
      expect(
        screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.targetAmountInvalid),
      ).toBeDefined();
    });

    it("displays a submit error when onSave rejects", async () => {
      const { onSave } = renderDialog();
      onSave.mockRejectedValue(new Error("Network error"));
      openDialog();
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
    });
  });

  describe("Saving persists changes via the service layer and updates the list immediately", () => {
    it("closes the dialog after a successful save", async () => {
      renderDialog();
      openDialog();
      expect(
        screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.dialogTitle),
      ).toBeDefined();
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.dialogTitle),
        ).toBeNull();
      });
    });

    it("does not close the dialog when onSave rejects", async () => {
      const { onSave } = renderDialog();
      onSave.mockRejectedValue(new Error("Network error"));
      openDialog();
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.saveButton,
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
      expect(
        screen.getByText(EDIT_SAVINGS_GOAL_DIALOG_COPY.dialogTitle),
      ).toBeDefined();
    });
  });

  describe("cancel", () => {
    it("does not call onSave when cancel is clicked", () => {
      const { onSave } = renderDialog();
      openDialog();
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.cancelButton,
        }),
      );
      expect(onSave).not.toHaveBeenCalled();
    });

    it("resets form state when reopened after cancel", () => {
      renderDialog({ goal: makeGoal({ name: "Original Name" }) });
      openDialog("Original Name");
      fireEvent.change(
        screen.getByLabelText(EDIT_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "Edited Name" } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: EDIT_SAVINGS_GOAL_DIALOG_COPY.cancelButton,
        }),
      );
      openDialog("Original Name");
      const nameInput = screen.getByLabelText(
        EDIT_SAVINGS_GOAL_DIALOG_COPY.nameLabel,
      );
      expect((nameInput as HTMLInputElement).value).toBe("Original Name");
    });
  });
});
