import { describe, it, expect } from "vitest";
import { annuityToFirebase, firebaseToAnnuity } from "./annuities";

describe("annuityToFirebase", () => {
  it("serializes date to ISO string", () => {
    const startDate = new Date("2024-01-01T00:00:00.000Z");
    const result = annuityToFirebase({
      name: "Netflix",
      monthlyAmount: 15,
      startDate,
      durationMonths: 12,
    });
    expect(result.startDate).toBe("2024-01-01T00:00:00.000Z");
  });

  it("converts undefined durationMonths to null", () => {
    const result = annuityToFirebase({
      name: "Rent",
      monthlyAmount: 1500,
      startDate: new Date(),
      durationMonths: undefined,
    });
    expect(result.durationMonths).toBeNull();
  });

  it("preserves numeric durationMonths", () => {
    const result = annuityToFirebase({
      name: "Car loan",
      monthlyAmount: 350,
      startDate: new Date(),
      durationMonths: 60,
    });
    expect(result.durationMonths).toBe(60);
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
    });
    const result = firebaseToAnnuity("a-1", firebase);
    expect(result.startDate.toISOString()).toBe(startDate.toISOString());
  });
});
