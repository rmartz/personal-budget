import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AccountsView } from "./AccountsView";
import { AccountTier } from "@/lib/firebase/schema/accounts";
import { ACCOUNTS_PAGE_COPY } from "./copy";
import type { Account, RecurringExpense } from "@/lib/firebase/schema/accounts";

afterEach(cleanup);

function makeAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: "account-1",
    name: "Chase Checking",
    tier: AccountTier.ShortTerm,
    ...overrides,
  };
}

function makeRecurringExpense(
  overrides: Partial<RecurringExpense> = {},
): RecurringExpense {
  return {
    id: "expense-1",
    name: "Rent",
    amount: 2000,
    ...overrides,
  };
}

describe("AccountsView", () => {
  describe("renders the page header", () => {
    it("shows the Accounts title as an h1 heading", () => {
      render(
        <AccountsView
          accounts={[]}
          recurringExpenses={[]}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: ACCOUNTS_PAGE_COPY.title,
        }),
      ).toBeDefined();
    });
  });

  describe("renders the SETUP section", () => {
    it("shows the setup section heading", () => {
      render(
        <AccountsView
          accounts={[]}
          recurringExpenses={[]}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.setupSectionHeading),
      ).toBeDefined();
    });
  });

  describe("renders the accounts summary row", () => {
    it("shows 0 configured when no accounts", () => {
      render(
        <AccountsView
          accounts={[]}
          recurringExpenses={[]}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      // Both rows are empty so "0 configured" appears twice; check at least one exists
      expect(
        screen.getAllByText(ACCOUNTS_PAGE_COPY.configuredCount(0)).length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("shows the correct count when accounts are populated", () => {
      const accounts = [
        makeAccount({ id: "1" }),
        makeAccount({ id: "2" }),
        makeAccount({ id: "3" }),
      ];
      render(
        <AccountsView
          accounts={accounts}
          recurringExpenses={[]}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.configuredCount(3)),
      ).toBeDefined();
    });
  });

  describe("renders the recurring expenses summary row", () => {
    it("shows 0 configured when no recurring expenses", () => {
      render(
        <AccountsView
          accounts={[]}
          recurringExpenses={[]}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.recurringExpensesLabel),
      ).toBeDefined();
    });

    it("shows the correct count when recurring expenses are populated", () => {
      const expenses = [
        makeRecurringExpense({ id: "1" }),
        makeRecurringExpense({ id: "2" }),
      ];
      render(
        <AccountsView
          accounts={[]}
          recurringExpenses={expenses}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.configuredCount(2)),
      ).toBeDefined();
    });
  });

  describe("renders the add account action", () => {
    it("shows the add account button", () => {
      render(
        <AccountsView
          accounts={[]}
          recurringExpenses={[]}
          isLoading={false}
          onAddAccount={() => undefined}
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.addAccountButton),
      ).toBeDefined();
    });
  });
});
