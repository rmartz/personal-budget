import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { NewSavingsGoalDialog } from "../NewSavingsGoalDialog";
import { NEW_SAVINGS_GOAL_DIALOG_COPY } from "../NewSavingsGoalDialog.copy";

afterEach(cleanup);

describe("NewSavingsGoalDialog", () => {
  describe("Validation: name must be non-empty", () => {
    it("shows a name error and does not call onSubmit when name is empty", async () => {
      const onSubmit = vi.fn();
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Validation: target must be a positive number", () => {
    it("shows a target amount error when target is empty", async () => {
      const onSubmit = vi.fn();
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows a target amount error when target is zero", async () => {
      const onSubmit = vi.fn();
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "0" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows a target amount error when target is negative", async () => {
      const onSubmit = vi.fn();
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "-100" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Submitting persists the goal via the service layer", () => {
    it("calls onSubmit with trimmed name and parsed targetAmount on valid submission", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "  Emergency Fund  " } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "5000.50" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith("Emergency Fund", 5000.5);
      });
    });

    it("calls onOpenChange with false after successful submission", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onOpenChange = vi.fn();
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "1000" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("shows a submit error message when onSubmit rejects", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "1000" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
    });

    it("does not call onOpenChange with false when onSubmit rejects", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      const onOpenChange = vi.fn();
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.targetAmountLabel),
        { target: { value: "1000" } },
      );
      fireEvent.submit(document.querySelector("form")!);

      await waitFor(() => {
        expect(
          screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });

    it("resets form fields when the dialog closes", () => {
      render(
        <NewSavingsGoalDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn().mockResolvedValue(undefined)}
        />,
      );

      fireEvent.change(
        screen.getByLabelText(NEW_SAVINGS_GOAL_DIALOG_COPY.nameLabel),
        { target: { value: "My Goal" } },
      );
      expect(screen.queryByDisplayValue("My Goal")).not.toBeNull();

      fireEvent.click(
        screen.getByText(NEW_SAVINGS_GOAL_DIALOG_COPY.cancelButton),
      );

      expect(screen.queryByDisplayValue("My Goal")).toBeNull();
    });
  });
});
