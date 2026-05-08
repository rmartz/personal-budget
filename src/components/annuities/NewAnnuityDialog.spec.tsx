import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { NewAnnuityDialog, NewAnnuityDialogView } from "./NewAnnuityDialog";
import { NEW_ANNUITY_DIALOG_COPY } from "./copy";

afterEach(cleanup);

function renderView(
  overrides: Partial<Parameters<typeof NewAnnuityDialogView>[0]> = {},
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    name: "",
    onNameChange: vi.fn(),
    monthlyAmount: "",
    onMonthlyAmountChange: vi.fn(),
    durationMonths: "",
    onDurationMonthsChange: vi.fn(),
    nameError: undefined,
    monthlyAmountError: undefined,
    submitError: undefined,
    onSubmit: vi.fn(),
    isSubmitting: false,
    ...overrides,
  };
  render(<NewAnnuityDialogView {...props} />);
  return props;
}

describe("NewAnnuityDialogView", () => {
  describe("A 'New annuity' action opens a creation dialog", () => {
    it("renders the dialog title", () => {
      renderView();
      expect(screen.getByText(NEW_ANNUITY_DIALOG_COPY.title)).toBeDefined();
    });
  });

  describe("For the flat-rate path: form fields are name (required) and monthly amount (required, positive)", () => {
    it("renders the name label", () => {
      renderView();
      expect(screen.getByText(NEW_ANNUITY_DIALOG_COPY.nameLabel)).toBeDefined();
    });

    it("renders the monthly amount label", () => {
      renderView();
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
      ).toBeDefined();
    });

    it("renders the submit button", () => {
      renderView();
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the cancel button", () => {
      renderView();
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });

    it("does not render a name error when nameError is undefined", () => {
      renderView({ nameError: undefined });
      expect(
        screen.queryByText(NEW_ANNUITY_DIALOG_COPY.nameRequiredError),
      ).toBeNull();
    });

    it("renders a name error when nameError is set", () => {
      renderView({ nameError: NEW_ANNUITY_DIALOG_COPY.nameRequiredError });
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.nameRequiredError),
      ).toBeDefined();
    });

    it("does not render a monthly amount error when monthlyAmountError is undefined", () => {
      renderView({ monthlyAmountError: undefined });
      expect(
        screen.queryByText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountRequiredError),
      ).toBeNull();
    });

    it("renders a monthly amount error when monthlyAmountError is set", () => {
      renderView({
        monthlyAmountError: NEW_ANNUITY_DIALOG_COPY.monthlyAmountRequiredError,
      });
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountRequiredError),
      ).toBeDefined();
    });

    it("calls onNameChange when the name input changes", () => {
      const onNameChange = vi.fn();
      renderView({ onNameChange });
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Spotify" } },
      );
      expect(onNameChange).toHaveBeenCalledWith("Spotify");
    });

    it("calls onMonthlyAmountChange when the monthly amount input changes", () => {
      const onMonthlyAmountChange = vi.fn();
      renderView({ onMonthlyAmountChange });
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "49.99" } },
      );
      expect(onMonthlyAmountChange).toHaveBeenCalledWith("49.99");
    });
  });

  describe("Optional duration in months (if omitted, the annuity is indefinite)", () => {
    it("renders the duration months label", () => {
      renderView();
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.durationMonthsLabel),
      ).toBeDefined();
    });

    it("calls onDurationMonthsChange when the duration input changes", () => {
      const onDurationMonthsChange = vi.fn();
      renderView({ onDurationMonthsChange });
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.durationMonthsLabel),
        { target: { value: "12" } },
      );
      expect(onDurationMonthsChange).toHaveBeenCalledWith("12");
    });
  });

  describe("All user-facing strings in a co-located copy file", () => {
    it("submit error is not rendered when submitError is undefined", () => {
      renderView({ submitError: undefined });
      expect(
        screen.queryByText(NEW_ANNUITY_DIALOG_COPY.submitError),
      ).toBeNull();
    });

    it("renders submit error when submitError is set", () => {
      renderView({ submitError: NEW_ANNUITY_DIALOG_COPY.submitError });
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.submitError),
      ).toBeDefined();
    });

    it("disables submit button while isSubmitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_ANNUITY_DIALOG_COPY.submitButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });

    it("disables cancel button while isSubmitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_ANNUITY_DIALOG_COPY.cancelButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });
  });
});

describe("NewAnnuityDialog", () => {
  describe("For the flat-rate path: form fields are name (required) and monthly amount (required, positive)", () => {
    it("shows a name error and does not call onSubmit when name is empty", async () => {
      const onSubmit = vi.fn();
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(NEW_ANNUITY_DIALOG_COPY.nameRequiredError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows a monthly amount error when monthly amount is empty", async () => {
      const onSubmit = vi.fn();
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Spotify" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountRequiredError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows a monthly amount error when monthly amount is not positive", async () => {
      const onSubmit = vi.fn();
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Spotify" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "-10" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError),
        ).toBeDefined();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Optional duration in months (if omitted, the annuity is indefinite)", () => {
    it("calls onSubmit with undefined durationMonths when duration is empty", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Netflix" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "15.99" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith("Netflix", 15.99, undefined);
      });
    });

    it("calls onSubmit with parsed durationMonths when duration is provided", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Car Loan" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "425.50" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.durationMonthsLabel),
        { target: { value: "48" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith("Car Loan", 425.5, 48);
      });
    });
  });

  describe("Submitting persists the annuity via the service layer and it appears in the list immediately", () => {
    it("calls onOpenChange with false after successful submission", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onOpenChange = vi.fn();
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Netflix" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "15.99" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("shows a submit error message when onSubmit rejects", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Netflix" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "15.99" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(NEW_ANNUITY_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
    });

    it("does not call onOpenChange with false when onSubmit rejects", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      const onOpenChange = vi.fn();
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Netflix" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "15.99" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(NEW_ANNUITY_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });

    it("resets form fields when the dialog closes", () => {
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn().mockResolvedValue(undefined)}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Netflix" } },
      );
      expect(screen.queryByDisplayValue("Netflix")).not.toBeNull();
      fireEvent.click(screen.getByText(NEW_ANNUITY_DIALOG_COPY.cancelButton));
      expect(screen.queryByDisplayValue("Netflix")).toBeNull();
    });

    it("clears the submit error when re-submitting with a validation failure", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      render(
        <NewAnnuityDialog
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "Netflix" } },
      );
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
        { target: { value: "15.99" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      await waitFor(() => {
        expect(
          screen.getByText(NEW_ANNUITY_DIALOG_COPY.submitError),
        ).toBeDefined();
      });
      fireEvent.change(
        screen.getByLabelText(NEW_ANNUITY_DIALOG_COPY.nameLabel),
        { target: { value: "" } },
      );
      fireEvent.submit(document.querySelector("form")!);
      expect(
        screen.queryByText(NEW_ANNUITY_DIALOG_COPY.submitError),
      ).toBeNull();
      expect(
        screen.getByText(NEW_ANNUITY_DIALOG_COPY.nameRequiredError),
      ).toBeDefined();
    });
  });
});
