import { describe, expect, it } from "vitest";

import {
  firebaseToInvestmentAccount,
  investmentAccountToFirebase,
} from "./investments";

describe("investmentAccountToFirebase", () => {
  it("serializes all fields without the id", () => {
    const result = investmentAccountToFirebase({
      name: "Vanguard Brokerage",
      currentPercent: 42,
      targetPercent: 60,
    });
    expect(result).toEqual({
      name: "Vanguard Brokerage",
      currentPercent: 42,
      targetPercent: 60,
    });
  });
});

describe("firebaseToInvestmentAccount", () => {
  it("sets id from the parameter", () => {
    const result = firebaseToInvestmentAccount("acct-1", {
      name: "Fidelity 401k",
      currentPercent: 25,
      targetPercent: 40,
    });
    expect(result.id).toBe("acct-1");
  });

  it("maps the stored percentages", () => {
    const result = firebaseToInvestmentAccount("acct-1", {
      name: "Fidelity 401k",
      currentPercent: 25,
      targetPercent: 40,
    });
    expect(result.currentPercent).toBe(25);
    expect(result.targetPercent).toBe(40);
  });

  it("round-trips through serialization", () => {
    const original = {
      name: "Roth IRA",
      currentPercent: 12,
      targetPercent: 18,
    };
    const firebase = investmentAccountToFirebase(original);
    const result = firebaseToInvestmentAccount("acct-2", firebase);
    expect(result.name).toBe(original.name);
    expect(result.currentPercent).toBe(original.currentPercent);
    expect(result.targetPercent).toBe(original.targetPercent);
  });
});
