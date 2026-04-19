import { describe, it, expect } from "vitest";
import {
  InvestmentLotType,
  investmentLotToFirebase,
  firebaseToInvestmentLot,
} from "./investment-lots";

describe("investmentLotToFirebase", () => {
  it("serializes date to ISO string", () => {
    const date = new Date("2024-05-10T00:00:00.000Z");
    const result = investmentLotToFirebase({
      type: InvestmentLotType.Purchase,
      date,
      units: 10,
      pricePerUnit: 150,
    });
    expect(result.date).toBe("2024-05-10T00:00:00.000Z");
  });

  it("preserves enum value", () => {
    const result = investmentLotToFirebase({
      type: InvestmentLotType.Sale,
      date: new Date(),
      units: 5,
      pricePerUnit: 200,
    });
    expect(result.type).toBe("sale");
  });
});

describe("firebaseToInvestmentLot", () => {
  it("sets id and ledgerId from parameters", () => {
    const result = firebaseToInvestmentLot("lot-1", "ledger-1", {
      type: InvestmentLotType.Purchase,
      date: "2024-05-10T00:00:00.000Z",
      units: 10,
      pricePerUnit: 150,
    });
    expect(result.id).toBe("lot-1");
    expect(result.ledgerId).toBe("ledger-1");
  });

  it("parses ISO date string to Date object", () => {
    const result = firebaseToInvestmentLot("lot-1", "ledger-1", {
      type: InvestmentLotType.Purchase,
      date: "2024-11-01T09:00:00.000Z",
      units: 2,
      pricePerUnit: 300,
    });
    expect(result.date).toEqual(new Date("2024-11-01T09:00:00.000Z"));
  });

  it("preserves enum value", () => {
    const result = firebaseToInvestmentLot("lot-1", "ledger-1", {
      type: InvestmentLotType.Sale,
      date: "2024-05-10T00:00:00.000Z",
      units: 5,
      pricePerUnit: 200,
    });
    expect(result.type).toBe(InvestmentLotType.Sale);
  });

  it("round-trips date through serialization", () => {
    const date = new Date("2025-01-20T14:00:00.000Z");
    const firebase = investmentLotToFirebase({
      type: InvestmentLotType.Purchase,
      date,
      units: 7,
      pricePerUnit: 420,
    });
    const result = firebaseToInvestmentLot("lot-1", "ledger-1", firebase);
    expect(result.date.toISOString()).toBe(date.toISOString());
  });
});
