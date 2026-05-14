import { describe, expect, it } from "vitest";

import { currencyFormatter } from "./formatters";

describe("currencyFormatter — shared USD formatter", () => {
  it("formats a whole dollar amount in en-US USD style", () => {
    expect(currencyFormatter.format(1000)).toBe("$1,000.00");
  });

  it("formats a decimal amount correctly", () => {
    expect(currencyFormatter.format(10000.5)).toBe("$10,000.50");
  });

  it("formats zero correctly", () => {
    expect(currencyFormatter.format(0)).toBe("$0.00");
  });
});
