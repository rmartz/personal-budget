import { describe, expect, it } from "vitest";

import {
  AnnuityMonthlyMode,
  annuityToFirebase,
  firebaseToAnnuity,
} from "./annuities";

describe("annuityToFirebase", () => {
  it("serializes presentValue and annualRatePercent for PVDerived annuity", () => {
    const result = annuityToFirebase({
      name: "Car Loan",
      monthlyAmount: 856.07,
      startDate: new Date(),
      durationMonths: 12,
      monthlyMode: AnnuityMonthlyMode.PVDerived,
      presentValue: 10000,
      annualRatePercent: 5,
    });
    expect(result.presentValue).toBe(10000);
    expect(result.annualRatePercent).toBe(5);
  });

  it("omits presentValue and annualRatePercent for Flat annuity", () => {
    const result = annuityToFirebase({
      name: "Netflix",
      monthlyAmount: 15,
      startDate: new Date(),
      durationMonths: undefined,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });
    expect(result.presentValue).toBeUndefined();
    expect(result.annualRatePercent).toBeUndefined();
  });

  it("serializes date to ISO string", () => {
    const startDate = new Date("2024-01-01T00:00:00.000Z");
    const result = annuityToFirebase({
      name: "Netflix",
      monthlyAmount: 15,
      startDate,
      durationMonths: 12,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });
    expect(result.startDate).toBe("2024-01-01T00:00:00.000Z");
  });

  it("converts undefined durationMonths to null", () => {
    const result = annuityToFirebase({
      name: "Rent",
      monthlyAmount: 1500,
      startDate: new Date(),
      durationMonths: undefined,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });
    expect(result.durationMonths).toBeNull();
  });

  it("preserves numeric durationMonths", () => {
    const result = annuityToFirebase({
      name: "Car loan",
      monthlyAmount: 350,
      startDate: new Date(),
      durationMonths: 60,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });
    expect(result.durationMonths).toBe(60);
  });

  it("serializes PVDerived monthlyMode correctly", () => {
    const result = annuityToFirebase({
      name: "Mortgage",
      monthlyAmount: 978.63,
      startDate: new Date(),
      durationMonths: 360,
      monthlyMode: AnnuityMonthlyMode.PVDerived,
    });
    expect(result.monthlyMode).toBe(AnnuityMonthlyMode.PVDerived);
  });
});

describe("firebaseToAnnuity", () => {
  it("sets id from parameter", () => {
    const result = firebaseToAnnuity("annuity-1", {
      name: "Netflix",
      monthlyAmount: 15,
      startDate: "2024-01-01T00:00:00.000Z",
      durationMonths: 12,
    });
    expect(result.id).toBe("annuity-1");
  });

  it("converts null durationMonths to undefined", () => {
    const result = firebaseToAnnuity("annuity-1", {
      name: "Rent",
      monthlyAmount: 1500,
      startDate: "2024-01-01T00:00:00.000Z",
      durationMonths: null,
    });
    expect(result.durationMonths).toBeUndefined();
  });

  it("parses ISO date string to Date object", () => {
    const result = firebaseToAnnuity("annuity-1", {
      name: "Spotify",
      monthlyAmount: 10,
      startDate: "2024-06-15T00:00:00.000Z",
      durationMonths: null,
    });
    expect(result.startDate).toEqual(new Date("2024-06-15T00:00:00.000Z"));
  });

  it("round-trips durationMonths null/undefined", () => {
    const firebase = annuityToFirebase({
      name: "Indefinite",
      monthlyAmount: 100,
      startDate: new Date(),
      durationMonths: undefined,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });
    const result = firebaseToAnnuity("a-1", firebase);
    expect(result.durationMonths).toBeUndefined();
  });

  it("round-trips date through serialization", () => {
    const startDate = new Date("2025-03-01T00:00:00.000Z");
    const firebase = annuityToFirebase({
      name: "Gym",
      monthlyAmount: 50,
      startDate,
      durationMonths: 24,
      monthlyMode: AnnuityMonthlyMode.Flat,
    });
    const result = firebaseToAnnuity("a-1", firebase);
    expect(result.startDate.toISOString()).toBe(startDate.toISOString());
  });

  it("defaults monthlyMode to Flat when field is absent from Firebase record", () => {
    const result = firebaseToAnnuity("a-1", {
      name: "Legacy",
      monthlyAmount: 200,
      startDate: "2020-01-01T00:00:00.000Z",
      durationMonths: null,
    });
    expect(result.monthlyMode).toBe(AnnuityMonthlyMode.Flat);
  });

  it("deserializes presentValue and annualRatePercent from a PVDerived Firebase record", () => {
    const result = firebaseToAnnuity("a-1", {
      name: "Car Loan",
      monthlyAmount: 856.07,
      startDate: "2024-01-01T00:00:00.000Z",
      durationMonths: 12,
      monthlyMode: AnnuityMonthlyMode.PVDerived,
      presentValue: 10000,
      annualRatePercent: 5,
    });
    expect(result.presentValue).toBe(10000);
    expect(result.annualRatePercent).toBe(5);
  });

  it("leaves presentValue and annualRatePercent undefined when absent from Firebase record", () => {
    const result = firebaseToAnnuity("a-1", {
      name: "Legacy",
      monthlyAmount: 200,
      startDate: "2020-01-01T00:00:00.000Z",
      durationMonths: null,
    });
    expect(result.presentValue).toBeUndefined();
    expect(result.annualRatePercent).toBeUndefined();
  });

  it("round-trips presentValue and annualRatePercent for a PVDerived annuity", () => {
    const firebase = annuityToFirebase({
      name: "Mortgage",
      monthlyAmount: 1199.1,
      startDate: new Date("2025-01-01T00:00:00.000Z"),
      durationMonths: 360,
      monthlyMode: AnnuityMonthlyMode.PVDerived,
      presentValue: 200000,
      annualRatePercent: 6,
    });
    const result = firebaseToAnnuity("m-1", firebase);
    expect(result.presentValue).toBe(200000);
    expect(result.annualRatePercent).toBe(6);
  });
});
