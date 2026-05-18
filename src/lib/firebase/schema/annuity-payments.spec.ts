import { describe, expect, it } from "vitest";

import {
  annuityPaymentToFirebase,
  firebaseToAnnuityPayment,
} from "./annuity-payments";

describe("annuityPaymentToFirebase", () => {
  it("serializes date to ISO string", () => {
    const date = new Date("2024-03-15T12:00:00.000Z");
    const result = annuityPaymentToFirebase({
      amount: 250,
      date,
    });
    expect(result.date).toBe("2024-03-15T12:00:00.000Z");
  });

  it("preserves amount", () => {
    const result = annuityPaymentToFirebase({
      amount: 500.75,
      date: new Date("2024-03-01T00:00:00.000Z"),
    });
    expect(result.amount).toBe(500.75);
  });

  it("includes notes when provided", () => {
    const result = annuityPaymentToFirebase({
      amount: 100,
      date: new Date("2024-03-01T00:00:00.000Z"),
      notes: "Extra payment",
    });
    expect(result.notes).toBe("Extra payment");
  });

  it("omits notes when not provided", () => {
    const result = annuityPaymentToFirebase({
      amount: 100,
      date: new Date("2024-03-01T00:00:00.000Z"),
    });
    expect(result.notes).toBeUndefined();
  });
});

describe("firebaseToAnnuityPayment", () => {
  it("sets id and annuityId from parameters", () => {
    const result = firebaseToAnnuityPayment("pay-1", "ann-1", {
      amount: 250,
      date: "2024-03-15T12:00:00.000Z",
    });
    expect(result.id).toBe("pay-1");
    expect(result.annuityId).toBe("ann-1");
  });

  it("parses ISO date string to Date object", () => {
    const result = firebaseToAnnuityPayment("pay-1", "ann-1", {
      amount: 250,
      date: "2024-06-01T00:00:00.000Z",
    });
    expect(result.date).toEqual(new Date("2024-06-01T00:00:00.000Z"));
  });

  it("preserves amount", () => {
    const result = firebaseToAnnuityPayment("pay-1", "ann-1", {
      amount: 350.5,
      date: "2024-03-15T00:00:00.000Z",
    });
    expect(result.amount).toBe(350.5);
  });

  it("preserves optional notes", () => {
    const result = firebaseToAnnuityPayment("pay-1", "ann-1", {
      amount: 100,
      date: "2024-03-15T00:00:00.000Z",
      notes: "Early payment",
    });
    expect(result.notes).toBe("Early payment");
  });

  it("leaves notes as undefined when absent", () => {
    const result = firebaseToAnnuityPayment("pay-1", "ann-1", {
      amount: 100,
      date: "2024-03-15T00:00:00.000Z",
    });
    expect(result.notes).toBeUndefined();
  });

  it("round-trips date through serialization", () => {
    const date = new Date("2024-09-20T08:30:00.000Z");
    const firebase = annuityPaymentToFirebase({
      amount: 200,
      date,
    });
    const result = firebaseToAnnuityPayment("pay-1", "ann-1", firebase);
    expect(result.date.toISOString()).toBe(date.toISOString());
  });
});
