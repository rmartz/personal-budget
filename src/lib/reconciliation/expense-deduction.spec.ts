import { describe, expect, it } from "vitest";

import { applyExpenseDeduction } from "./expense-deduction";

describe("applyExpenseDeduction — cash covers the expense", () => {
  it("deducts entirely from cash when cash is sufficient", () => {
    const result = applyExpenseDeduction({
      cashBalance: 500,
      expenseAmount: 200,
      investmentBalance: 300,
    });
    expect(result.cashBalance).toBe(300);
    expect(result.investmentBalance).toBe(300);
  });

  it("reduces cash to zero when the expense exactly matches the cash balance", () => {
    const result = applyExpenseDeduction({
      cashBalance: 400,
      expenseAmount: 400,
      investmentBalance: 100,
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(100);
  });
});

describe("applyExpenseDeduction — expense exceeds cash", () => {
  it("exhausts cash and deducts the remainder from investment", () => {
    const result = applyExpenseDeduction({
      cashBalance: 200,
      expenseAmount: 350,
      investmentBalance: 500,
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(350);
  });

  it("deducts entirely from investment when cash balance is zero", () => {
    const result = applyExpenseDeduction({
      cashBalance: 0,
      expenseAmount: 150,
      investmentBalance: 600,
    });
    expect(result.cashBalance).toBe(0);
    expect(result.investmentBalance).toBe(450);
  });
});
