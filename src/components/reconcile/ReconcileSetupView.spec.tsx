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

import { ReconcileSetupView } from "./ReconcileSetupView";
import { RECONCILE_SETUP_VIEW_COPY } from "./ReconcileSetupView.copy";

afterEach(cleanup);

function makeAccount(
  overrides: Partial<ReconciliationAccount> = {},
): ReconciliationAccount {
  return {
    id: "account-1",
    name: "Chase Checking",
    tier: ReconciliationAccountTier.ShortTerm,
    targetFloat: 2000,
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
  onEditAccount: vi.fn(),
  onDeleteAccount: vi.fn(),
  onEditExpense: vi.fn(),
  onDeleteExpense: vi.fn(),
};

describe("ReconcileSetupView — accounts section", () => {
  it("renders the accounts section heading", () => {
    render(<ReconcileSetupView {...baseProps} />);
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.accountsSectionHeading),
    ).toBeDefined();
  });

  it("shows the cash accounts group label", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[makeAccount({ tier: ReconciliationAccountTier.ShortTerm })]}
      />,
    );
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.cashAccountsGroupLabel),
    ).toBeDefined();
  });

  it("shows the investment accounts group label", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[makeAccount({ tier: ReconciliationAccountTier.Investment })]}
      />,
    );
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.investmentAccountsGroupLabel),
    ).toBeDefined();
  });

  it("renders each account name", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[makeAccount({ name: "Chase Checking" })]}
      />,
    );
    expect(screen.getByText("Chase Checking")).toBeDefined();
  });

  it("renders the target float for cash accounts", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[makeAccount({ targetFloat: 2000 })]}
      />,
    );
    expect(screen.getByText("$2,000.00")).toBeDefined();
  });

  it("does not render target float for investment accounts", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[
          makeAccount({
            tier: ReconciliationAccountTier.Investment,
            targetFloat: undefined,
          }),
        ]}
      />,
    );
    expect(screen.queryByText("$2,000.00")).toBeNull();
  });

  it("shows accounts empty state when no accounts", () => {
    render(<ReconcileSetupView {...baseProps} />);
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.accountsEmptyState),
    ).toBeDefined();
  });

  it("hides accounts empty state when accounts exist", () => {
    render(<ReconcileSetupView {...baseProps} accounts={[makeAccount()]} />);
    expect(
      screen.queryByText(RECONCILE_SETUP_VIEW_COPY.accountsEmptyState),
    ).toBeNull();
  });

  it("calls onEditAccount when edit is clicked", () => {
    const onEditAccount = vi.fn();
    const account = makeAccount();
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[account]}
        onEditAccount={onEditAccount}
      />,
    );
    fireEvent.click(screen.getByText(RECONCILE_SETUP_VIEW_COPY.editButton));
    expect(onEditAccount).toHaveBeenCalledWith(account);
  });

  it("calls onDeleteAccount when delete is clicked", () => {
    const onDeleteAccount = vi.fn();
    const account = makeAccount();
    render(
      <ReconcileSetupView
        {...baseProps}
        accounts={[account]}
        onDeleteAccount={onDeleteAccount}
      />,
    );
    fireEvent.click(screen.getByText(RECONCILE_SETUP_VIEW_COPY.deleteButton));
    expect(onDeleteAccount).toHaveBeenCalledWith(account);
  });
});

describe("ReconcileSetupView — expenses section", () => {
  it("renders the expenses section heading", () => {
    render(<ReconcileSetupView {...baseProps} />);
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.expensesSectionHeading),
    ).toBeDefined();
  });

  it("renders each expense name", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        expenses={[makeExpense({ name: "Electric bill" })]}
      />,
    );
    expect(screen.getByText("Electric bill")).toBeDefined();
  });

  it("renders each expense typical amount", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        expenses={[makeExpense({ typicalAmount: 350 })]}
      />,
    );
    expect(screen.getByText("$350.00", { exact: false })).toBeDefined();
  });

  it("renders the Statement type label for statement-balance expenses", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        expenses={[
          makeExpense({ type: ReconciliationExpenseType.StatementBalance }),
        ]}
      />,
    );
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.expenseTypeStatementBalance, {
        exact: false,
      }),
    ).toBeDefined();
  });

  it("renders the Running balance type label for running-balance expenses", () => {
    render(
      <ReconcileSetupView
        {...baseProps}
        expenses={[
          makeExpense({ type: ReconciliationExpenseType.RunningBalance }),
        ]}
      />,
    );
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.expenseTypeRunningBalance, {
        exact: false,
      }),
    ).toBeDefined();
  });

  it("shows expenses empty state when no expenses", () => {
    render(<ReconcileSetupView {...baseProps} />);
    expect(
      screen.getByText(RECONCILE_SETUP_VIEW_COPY.expensesEmptyState),
    ).toBeDefined();
  });

  it("hides expenses empty state when expenses exist", () => {
    render(<ReconcileSetupView {...baseProps} expenses={[makeExpense()]} />);
    expect(
      screen.queryByText(RECONCILE_SETUP_VIEW_COPY.expensesEmptyState),
    ).toBeNull();
  });

  it("calls onEditExpense when edit is clicked", () => {
    const onEditExpense = vi.fn();
    const expense = makeExpense();
    render(
      <ReconcileSetupView
        {...baseProps}
        expenses={[expense]}
        onEditExpense={onEditExpense}
      />,
    );
    fireEvent.click(screen.getByText(RECONCILE_SETUP_VIEW_COPY.editButton));
    expect(onEditExpense).toHaveBeenCalledWith(expense);
  });

  it("calls onDeleteExpense when delete is clicked", () => {
    const onDeleteExpense = vi.fn();
    const expense = makeExpense();
    render(
      <ReconcileSetupView
        {...baseProps}
        expenses={[expense]}
        onDeleteExpense={onDeleteExpense}
      />,
    );
    fireEvent.click(screen.getByText(RECONCILE_SETUP_VIEW_COPY.deleteButton));
    expect(onDeleteExpense).toHaveBeenCalledWith(expense);
  });
});
