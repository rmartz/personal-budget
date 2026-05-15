import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CREATE_LEDGER_DIALOG_COPY } from "./copy";
import { CreateLedgerDialogContainer } from "./CreateLedgerDialogContainer";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: { uid: "test-uid" }, loading: false }),
}));

const mockMutateAsync = vi.fn();

vi.mock("@/hooks/use-create-ledger", () => ({
  useCreateLedger: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("CreateLedgerDialogContainer", () => {
  it("renders CreateLedgerDialog when open", () => {
    render(<CreateLedgerDialogContainer open={true} onClose={vi.fn()} />);
    expect(screen.getByText(CREATE_LEDGER_DIALOG_COPY.title)).toBeDefined();
  });

  it("does not render CreateLedgerDialog content when closed", () => {
    render(<CreateLedgerDialogContainer open={false} onClose={vi.fn()} />);
    expect(screen.queryByText(CREATE_LEDGER_DIALOG_COPY.title)).toBeNull();
  });

  it("calls mutateAsync with CreateLedgerInput on valid submission", async () => {
    mockMutateAsync.mockResolvedValue(undefined);
    render(<CreateLedgerDialogContainer open={true} onClose={vi.fn()} />);

    fireEvent.change(
      screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
      { target: { value: "My New Ledger" } },
    );
    fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "My New Ledger",
        cashCap: undefined,
      });
    });
  });

  it("calls mutateAsync with name and cashCap when cashCap is provided", async () => {
    mockMutateAsync.mockResolvedValue(undefined);
    render(<CreateLedgerDialogContainer open={true} onClose={vi.fn()} />);

    fireEvent.change(
      screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
      { target: { value: "Savings" } },
    );
    fireEvent.change(
      screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.cashCapLabel),
      { target: { value: "1000" } },
    );
    fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "Savings",
        cashCap: 1000,
      });
    });
  });

  it("calls onClose after a successful submission", async () => {
    mockMutateAsync.mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<CreateLedgerDialogContainer open={true} onClose={onClose} />);

    fireEvent.change(
      screen.getByLabelText(CREATE_LEDGER_DIALOG_COPY.nameLabel),
      { target: { value: "Budget" } },
    );
    fireEvent.click(screen.getByText(CREATE_LEDGER_DIALOG_COPY.submitButton));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
