import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { NewLedgerDialog, NewLedgerDialogView } from "./NewLedgerDialog";
import { NEW_LEDGER_DIALOG_COPY } from "./copy";

afterEach(cleanup);

function renderView(
  overrides: Partial<Parameters<typeof NewLedgerDialogView>[0]> = {},
) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    name: "",
    onNameChange: vi.fn(),
    cashCap: "",
    onCashCapChange: vi.fn(),
    nameError: undefined,
    cashCapError: undefined,
    submitError: undefined,
    onSubmit: vi.fn(),
    isSubmitting: false,
    ...overrides,
  };
  render(<NewLedgerDialogView {...props} />);
  return props;
}

describe("NewLedgerDialogView", () => {
  describe("empty form", () => {
    it("renders the dialog title", () => {
      renderView();
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.title)).toBeDefined();
    });

    it("renders the name label", () => {
      renderView();
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.nameLabel)).toBeDefined();
    });

    it("renders the cash cap label", () => {
      renderView();
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.cashCapLabel),
      ).toBeDefined();
    });

    it("renders the submit button", () => {
      renderView();
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the cancel button", () => {
      renderView();
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.cancelButton),
      ).toBeDefined();
    });

    it("does not render name error when nameError is undefined", () => {
      renderView({ nameError: undefined });
      expect(screen.queryByText(NEW_LEDGER_DIALOG_COPY.nameError)).toBeNull();
    });

    it("does not render cash cap error when cashCapError is undefined", () => {
      renderView({ cashCapError: undefined });
      expect(
        screen.queryByText(NEW_LEDGER_DIALOG_COPY.cashCapError),
      ).toBeNull();
    });

    it("does not render submit error when submitError is undefined", () => {
      renderView({ submitError: undefined });
      expect(screen.queryByText(NEW_LEDGER_DIALOG_COPY.submitError)).toBeNull();
    });
  });

  describe("validation error state", () => {
    it("renders the name error message", () => {
      renderView({ nameError: NEW_LEDGER_DIALOG_COPY.nameError });
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.nameError)).toBeDefined();
    });

    it("renders the cash cap error message", () => {
      renderView({ cashCapError: NEW_LEDGER_DIALOG_COPY.cashCapError });
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.cashCapError),
      ).toBeDefined();
    });

    it("renders the submit error message", () => {
      renderView({ submitError: NEW_LEDGER_DIALOG_COPY.submitError });
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
  });

  describe("interactions", () => {
    it("calls onSubmit when the form is submitted", () => {
      const onSubmit = vi.fn();
      render(
        <NewLedgerDialogView
          open={true}
          onOpenChange={vi.fn()}
          name="Test"
          onNameChange={vi.fn()}
          cashCap=""
          onCashCapChange={vi.fn()}
          nameError={undefined}
          cashCapError={undefined}
          submitError={undefined}
          onSubmit={onSubmit}
          isSubmitting={false}
        />,
      );
      fireEvent.submit(document.querySelector("form")!);
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    it("calls onNameChange when the name input changes", () => {
      const onNameChange = vi.fn();
      renderView({ onNameChange });
      fireEvent.change(
        screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel),
        {
          target: { value: "My Budget" },
        },
      );
      expect(onNameChange).toHaveBeenCalledWith("My Budget");
    });

    it("calls onCashCapChange when the cash cap input changes", () => {
      const onCashCapChange = vi.fn();
      renderView({ onCashCapChange });
      fireEvent.change(
        screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.cashCapLabel),
        { target: { value: "500" } },
      );
      expect(onCashCapChange).toHaveBeenCalledWith("500");
    });

    it("disables the submit button while submitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_LEDGER_DIALOG_COPY.submitButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });

    it("disables the cancel button while submitting", () => {
      renderView({ isSubmitting: true });
      expect(
        screen
          .getByText(NEW_LEDGER_DIALOG_COPY.cancelButton)
          .hasAttribute("disabled"),
      ).toBe(true);
    });
  });
});

describe("NewLedgerDialog", () => {
  it("shows a name error and does not call onSubmit when name is empty", async () => {
    const onSubmit = vi.fn();
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByText(NEW_LEDGER_DIALOG_COPY.nameError)).toBeDefined();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with trimmed name and parsed cashCap on valid submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel), {
      target: { value: "  My Ledger  " },
    });
    fireEvent.change(
      screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.cashCapLabel),
      { target: { value: "250.50" } },
    );
    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("My Ledger", 250.5);
    });
  });

  it("calls onOpenChange with false after successful submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel), {
      target: { value: "My Ledger" },
    });
    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("shows a submit error message when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel), {
      target: { value: "My Ledger" },
    });
    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
  });

  it("does not call onOpenChange with false when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
    const onOpenChange = vi.fn();
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel), {
      target: { value: "My Ledger" },
    });
    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(
        screen.getByText(NEW_LEDGER_DIALOG_COPY.submitError),
      ).toBeDefined();
    });
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("does not call onOpenChange with false while a submission is in flight", async () => {
    let resolveSubmit: () => void = vi.fn();
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );
    const onOpenChange = vi.fn();
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel), {
      target: { value: "My Ledger" },
    });
    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    onOpenChange.mockClear();
    fireEvent.keyDown(document, { key: "Escape", keyCode: 27 });

    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    resolveSubmit();
  });

  it("resets form fields when the dialog closes", () => {
    render(
      <NewLedgerDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    fireEvent.change(screen.getByLabelText(NEW_LEDGER_DIALOG_COPY.nameLabel), {
      target: { value: "My Ledger" },
    });
    expect(screen.queryByDisplayValue("My Ledger")).not.toBeNull();

    fireEvent.click(screen.getByText(NEW_LEDGER_DIALOG_COPY.cancelButton));

    expect(screen.queryByDisplayValue("My Ledger")).toBeNull();
  });
});
