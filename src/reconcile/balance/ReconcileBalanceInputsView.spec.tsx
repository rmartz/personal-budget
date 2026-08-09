import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  type ReconciliationAccount,
  ReconciliationAccountTier,
} from "@/lib/firebase/schema/reconciliation-accounts";
import {
  type ReconciliationExpense,
  ReconciliationExpenseType,
} from "@/lib/firebase/schema/reconciliation-expenses";

import { ReconcileBalanceInputsView } from "./ReconcileBalanceInputsView";
import { RECONCILE_BALANCE_INPUTS_COPY } from "./ReconcileBalanceInputsView.copy";

afterEach(cleanup);

function makeAccount(
  overrides: Partial<ReconciliationAccount> = {},
): ReconciliationAccount {
  return {
    id: "account-1",
    name: "Chase Checking",
    tier: ReconciliationAccountTier.ShortTerm,
    ...overrides,
  };
}

function makeExpense(
  overrides: Partial<ReconciliationExpense> = {},
): ReconciliationExpense {
  return {
    id: "expense-1",
    name: "Electric bill",
    type: ReconciliationExpenseType.StatementBalance,
    typicalAmount: 120,
    ...overrides,
  };
}

const baseProps = {
  accounts: [],
  expenses: [],
  accountBalances: {},
  expenseAmounts: {},
  onAccountBalanceChange: vi.fn(),
  onExpenseAmountChange: vi.fn(),
};

describe("ReconcileBalanceInputsView — each account renders with name and balance input", () => {
  it("renders the account name", () => {
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        accounts={[makeAccount({ name: "Chase Checking" })]}
      />,
    );
    expect(screen.getByText("Chase Checking")).toBeDefined();
  });

  it("renders a balance input for each account", () => {
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        accounts={[makeAccount({ id: "acc-1", name: "Chase Checking" })]}
      />,
    );
    expect(
      screen.getByLabelText(
        RECONCILE_BALANCE_INPUTS_COPY.accountBalanceAriaLabel("Chase Checking"),
      ),
    ).toBeDefined();
  });

  it("pre-fills the account balance input from accountBalances prop", () => {
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        accounts={[makeAccount({ id: "acc-1" })]}
        accountBalances={{ "acc-1": 4200 }}
      />,
    );
    expect(screen.getByDisplayValue("4200")).toBeDefined();
  });
});

describe("ReconcileBalanceInputsView — each expense renders with name and amount input", () => {
  it("renders the expense name", () => {
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        expenses={[makeExpense({ name: "Electric bill" })]}
      />,
    );
    expect(screen.getByText("Electric bill")).toBeDefined();
  });

  it("renders an amount input for each expense", () => {
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        expenses={[makeExpense({ id: "exp-1", name: "Electric bill" })]}
      />,
    );
    expect(
      screen.getByLabelText(
        RECONCILE_BALANCE_INPUTS_COPY.expenseAmountAriaLabel("Electric bill"),
      ),
    ).toBeDefined();
  });

  it("pre-fills the expense amount input from expenseAmounts prop", () => {
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        expenses={[makeExpense({ id: "exp-1" })]}
        expenseAmounts={{ "exp-1": 350 }}
      />,
    );
    expect(screen.getByDisplayValue("350")).toBeDefined();
  });
});

describe("ReconcileBalanceInputsView — changing an account balance input fires onAccountBalanceChange", () => {
  it("calls onAccountBalanceChange with accountId and parsed number when input changes", () => {
    const onAccountBalanceChange = vi.fn();
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        accounts={[makeAccount({ id: "acc-42", name: "Savings" })]}
        onAccountBalanceChange={onAccountBalanceChange}
      />,
    );
    const input = screen.getByLabelText(
      RECONCILE_BALANCE_INPUTS_COPY.accountBalanceAriaLabel("Savings"),
    );
    fireEvent.change(input, { target: { value: "8500" } });
    expect(onAccountBalanceChange).toHaveBeenCalledWith("acc-42", 8500);
  });

  it("calls onAccountBalanceChange with undefined when input is cleared", () => {
    const onAccountBalanceChange = vi.fn();
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        accounts={[makeAccount({ id: "acc-42", name: "Savings" })]}
        accountBalances={{ "acc-42": 100 }}
        onAccountBalanceChange={onAccountBalanceChange}
      />,
    );
    const input = screen.getByLabelText(
      RECONCILE_BALANCE_INPUTS_COPY.accountBalanceAriaLabel("Savings"),
    );
    fireEvent.change(input, { target: { value: "" } });
    expect(onAccountBalanceChange).toHaveBeenCalledWith("acc-42", undefined);
  });
});

describe("ReconcileBalanceInputsView — changing an expense amount input fires onExpenseAmountChange", () => {
  it("calls onExpenseAmountChange with expenseId and parsed number when input changes", () => {
    const onExpenseAmountChange = vi.fn();
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        expenses={[makeExpense({ id: "exp-7", name: "Electric bill" })]}
        onExpenseAmountChange={onExpenseAmountChange}
      />,
    );
    const input = screen.getByLabelText(
      RECONCILE_BALANCE_INPUTS_COPY.expenseAmountAriaLabel("Electric bill"),
    );
    fireEvent.change(input, { target: { value: "125" } });
    expect(onExpenseAmountChange).toHaveBeenCalledWith("exp-7", 125);
  });

  it("calls onExpenseAmountChange with undefined when input is cleared", () => {
    const onExpenseAmountChange = vi.fn();
    render(
      <ReconcileBalanceInputsView
        {...baseProps}
        expenses={[makeExpense({ id: "exp-7", name: "Electric bill" })]}
        expenseAmounts={{ "exp-7": 120 }}
        onExpenseAmountChange={onExpenseAmountChange}
      />,
    );
    const input = screen.getByLabelText(
      RECONCILE_BALANCE_INPUTS_COPY.expenseAmountAriaLabel("Electric bill"),
    );
    fireEvent.change(input, { target: { value: "" } });
    expect(onExpenseAmountChange).toHaveBeenCalledWith("exp-7", undefined);
  });
});

describe("ReconcileBalanceInputsView — empty state when no accounts and no expenses", () => {
  it("shows the empty state message when no accounts and no expenses are provided", () => {
    render(<ReconcileBalanceInputsView {...baseProps} />);
    expect(
      screen.getByText(RECONCILE_BALANCE_INPUTS_COPY.emptyState),
    ).toBeDefined();
  });

  it("does not show the empty state message when at least one account is provided", () => {
    render(
      <ReconcileBalanceInputsView {...baseProps} accounts={[makeAccount()]} />,
    );
    expect(
      screen.queryByText(RECONCILE_BALANCE_INPUTS_COPY.emptyState),
    ).toBeNull();
  });

  it("does not show the empty state message when at least one expense is provided", () => {
    render(
      <ReconcileBalanceInputsView {...baseProps} expenses={[makeExpense()]} />,
    );
    expect(
      screen.queryByText(RECONCILE_BALANCE_INPUTS_COPY.emptyState),
    ).toBeNull();
  });
});
