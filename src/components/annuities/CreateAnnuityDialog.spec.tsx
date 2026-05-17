import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AnnuityMonthlyMode } from "@/lib/firebase/schema/annuities";

import { CREATE_ANNUITY_DIALOG_COPY } from "./copy";
import { CreateAnnuityDialogView } from "./CreateAnnuityDialog";

afterEach(cleanup);

describe("CreateAnnuityDialogView", () => {
  const baseProps = {
    open: true,
    onOpenChange: vi.fn(),
    mode: "flat" as const,
    onModeChange: vi.fn(),
    name: "",
    onNameChange: vi.fn(),
    monthlyAmount: "",
    onMonthlyAmountChange: vi.fn(),
    presentValue: "",
    onPresentValueChange: vi.fn(),
    annualRate: "",
    onAnnualRateChange: vi.fn(),
    durationMonths: "",
    onDurationMonthsChange: vi.fn(),
    monthlyPreview: undefined,
    nameError: undefined,
    monthlyAmountError: undefined,
    presentValueError: undefined,
    annualRateError: undefined,
    durationMonthsError: undefined,
    submitError: undefined,
    onSubmit: vi.fn(),
    isSubmitting: false,
  };

  describe("mode toggle", () => {
    it("renders a flat amount mode button", () => {
      render(<CreateAnnuityDialogView {...baseProps} />);
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.modeFlatButton),
      ).toBeDefined();
    });

    it("renders a loan terms mode button", () => {
      render(<CreateAnnuityDialogView {...baseProps} />);
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.modeLoanButton),
      ).toBeDefined();
    });

    it("calls onModeChange with 'pv' when loan terms button is clicked", () => {
      const onModeChange = vi.fn();
      render(
        <CreateAnnuityDialogView {...baseProps} onModeChange={onModeChange} />,
      );
      fireEvent.click(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.modeLoanButton),
      );
      expect(onModeChange).toHaveBeenCalledWith("pv");
    });

    it("calls onModeChange with 'flat' when flat button is clicked in pv mode", () => {
      const onModeChange = vi.fn();
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          mode="pv"
          onModeChange={onModeChange}
        />,
      );
      fireEvent.click(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.modeFlatButton),
      );
      expect(onModeChange).toHaveBeenCalledWith("flat");
    });
  });

  describe("flat mode fields", () => {
    it("renders the name field", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="flat" />);
      expect(
        screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.nameLabel),
      ).toBeDefined();
    });

    it("renders the monthly amount field in flat mode", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="flat" />);
      expect(
        screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
      ).toBeDefined();
    });

    it("does not render the present value field in flat mode", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="flat" />);
      expect(
        screen.queryByLabelText(CREATE_ANNUITY_DIALOG_COPY.presentValueLabel),
      ).toBeNull();
    });
  });

  describe("pv mode fields", () => {
    it("renders the present value field in pv mode", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="pv" />);
      expect(
        screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.presentValueLabel),
      ).toBeDefined();
    });

    it("renders the annual rate field in pv mode", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="pv" />);
      expect(
        screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.annualRateLabel),
      ).toBeDefined();
    });

    it("renders the duration field in pv mode", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="pv" />);
      expect(
        screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.durationLabel),
      ).toBeDefined();
    });

    it("does not render the monthly amount field in pv mode", () => {
      render(<CreateAnnuityDialogView {...baseProps} mode="pv" />);
      expect(
        screen.queryByLabelText(CREATE_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
      ).toBeNull();
    });
  });

  describe("monthly preview in pv mode", () => {
    it("does not render the preview when monthlyPreview is undefined", () => {
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          mode="pv"
          monthlyPreview={undefined}
        />,
      );
      expect(
        screen.queryByText(CREATE_ANNUITY_DIALOG_COPY.previewLabel),
      ).toBeNull();
    });

    it("renders the preview amount when monthlyPreview is set", () => {
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          mode="pv"
          monthlyPreview={856.07}
        />,
      );
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.previewLabel),
      ).toBeDefined();
    });
  });

  describe("validation errors", () => {
    it("shows the name error when nameError is provided", () => {
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          nameError={CREATE_ANNUITY_DIALOG_COPY.nameRequiredError}
        />,
      );
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.nameRequiredError),
      ).toBeDefined();
    });

    it("shows monthlyAmountError in flat mode", () => {
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          mode="flat"
          monthlyAmountError={
            CREATE_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError
          }
        />,
      );
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.monthlyAmountInvalidError),
      ).toBeDefined();
    });

    it("shows presentValueError in pv mode", () => {
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          mode="pv"
          presentValueError={
            CREATE_ANNUITY_DIALOG_COPY.presentValueInvalidError
          }
        />,
      );
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.presentValueInvalidError),
      ).toBeDefined();
    });
  });

  describe("submission", () => {
    it("renders the submit button", () => {
      render(<CreateAnnuityDialogView {...baseProps} />);
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the cancel button", () => {
      render(<CreateAnnuityDialogView {...baseProps} />);
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });

    it("calls onSubmit when the form is submitted", () => {
      const onSubmit = vi.fn();
      render(<CreateAnnuityDialogView {...baseProps} onSubmit={onSubmit} />);
      fireEvent.click(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.submitButton),
      );
      expect(onSubmit).toHaveBeenCalled();
    });

    it("disables submit and cancel buttons while isSubmitting", () => {
      render(<CreateAnnuityDialogView {...baseProps} isSubmitting={true} />);
      const submitBtn = screen
        .getByText(CREATE_ANNUITY_DIALOG_COPY.creatingButton)
        .closest("button");
      expect(submitBtn?.disabled).toBe(true);
    });

    it("shows submitError when provided", () => {
      render(
        <CreateAnnuityDialogView
          {...baseProps}
          submitError={CREATE_ANNUITY_DIALOG_COPY.submitError}
        />,
      );
      expect(
        screen.getByText(CREATE_ANNUITY_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
  });
});

describe("CreateAnnuityDialog integration", () => {
  it("calls onSubmit with derived monthly amount in pv mode", async () => {
    const { CreateAnnuityDialog } = await import("./CreateAnnuityDialog");
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();

    render(
      <CreateAnnuityDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    // Switch to pv mode
    fireEvent.click(
      screen.getByText(CREATE_ANNUITY_DIALOG_COPY.modeLoanButton),
    );

    // Fill in name
    fireEvent.change(
      screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.nameLabel),
      { target: { value: "Car Loan" } },
    );

    // Fill in PV fields: $10,000 at 5% for 12 months → ~$856.07
    fireEvent.change(
      screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.presentValueLabel),
      { target: { value: "10000" } },
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.annualRateLabel),
      { target: { value: "5" } },
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.durationLabel),
      { target: { value: "12" } },
    );

    fireEvent.click(screen.getByText(CREATE_ANNUITY_DIALOG_COPY.submitButton));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const callArg = onSubmit.mock.calls[0]![0] as {
      annualRatePercent: number | undefined;
      durationMonths: number;
      monthlyAmount: number;
      monthlyMode: AnnuityMonthlyMode;
      name: string;
      presentValue: number | undefined;
    };
    expect(callArg.annualRatePercent).toBe(5);
    expect(callArg.durationMonths).toBe(12);
    expect(Math.round(callArg.monthlyAmount * 100) / 100).toBe(856.07);
    expect(callArg.monthlyMode).toBe(AnnuityMonthlyMode.PVDerived);
    expect(callArg.name).toBe("Car Loan");
    expect(callArg.presentValue).toBe(10000);
  });

  it("calls onSubmit with flat monthly amount in flat mode", async () => {
    const { CreateAnnuityDialog } = await import("./CreateAnnuityDialog");
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CreateAnnuityDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.nameLabel),
      { target: { value: "Netflix" } },
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_ANNUITY_DIALOG_COPY.monthlyAmountLabel),
      { target: { value: "15.99" } },
    );

    fireEvent.click(screen.getByText(CREATE_ANNUITY_DIALOG_COPY.submitButton));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        annualRatePercent: undefined,
        durationMonths: undefined,
        monthlyAmount: 15.99,
        monthlyMode: AnnuityMonthlyMode.Flat,
        name: "Netflix",
        presentValue: undefined,
      });
    });
  });
});
