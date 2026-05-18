import { describe, expect, it } from "vitest";

import { Posture } from "@/lib/firebase/schema/investments";

import { applyPostureAdjustment } from "./posture-recommendation";

describe("applyPostureAdjustment — Aggressive posture", () => {
  it("returns buy recommendation unchanged when margin is positive", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: 200,
        posture: Posture.Aggressive,
      }),
    ).toBe(500);
  });

  it("returns buy recommendation unchanged when margin is negative", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: -200,
        posture: Posture.Aggressive,
      }),
    ).toBe(500);
  });

  it("returns sell recommendation unchanged when margin is negative", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: -300,
        margin: -100,
        posture: Posture.Aggressive,
      }),
    ).toBe(-300);
  });

  it("returns sell recommendation unchanged when margin is positive", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: -300,
        margin: 100,
        posture: Posture.Aggressive,
      }),
    ).toBe(-300);
  });
});

describe("applyPostureAdjustment — Balanced posture", () => {
  it("reduces buy recommendation by positive margin", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: 200,
        posture: Posture.Balanced,
      }),
    ).toBe(300);
  });

  it("clamps buy recommendation to zero when margin exceeds it", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 150,
        margin: 400,
        posture: Posture.Balanced,
      }),
    ).toBe(0);
  });

  it("leaves buy recommendation unchanged when margin is negative", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: -200,
        posture: Posture.Balanced,
      }),
    ).toBe(500);
  });

  it("leaves buy recommendation unchanged when margin is zero", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: 0,
        posture: Posture.Balanced,
      }),
    ).toBe(500);
  });

  it("reduces sell recommendation when margin is negative", () => {
    // sell -300, margin -100: -300 - (-100) = -200 → min(0, -200) = -200
    expect(
      applyPostureAdjustment({
        baseRecommendation: -300,
        margin: -100,
        posture: Posture.Balanced,
      }),
    ).toBe(-200);
  });

  it("clamps sell recommendation to zero when negative margin exceeds it", () => {
    // sell -50, margin -200: -50 - (-200) = 150 → min(0, 150) = 0
    expect(
      applyPostureAdjustment({
        baseRecommendation: -50,
        margin: -200,
        posture: Posture.Balanced,
      }),
    ).toBe(0);
  });

  it("leaves sell recommendation unchanged when margin is positive", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: -300,
        margin: 100,
        posture: Posture.Balanced,
      }),
    ).toBe(-300);
  });
});

describe("applyPostureAdjustment — Conservative posture", () => {
  it("reduces buy recommendation by positive margin", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: 200,
        posture: Posture.Conservative,
      }),
    ).toBe(300);
  });

  it("clamps buy recommendation to zero when margin exceeds it", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 150,
        margin: 400,
        posture: Posture.Conservative,
      }),
    ).toBe(0);
  });

  it("leaves buy recommendation unchanged when margin is negative", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: 500,
        margin: -200,
        posture: Posture.Conservative,
      }),
    ).toBe(500);
  });

  it("leaves sell recommendation unchanged when margin is negative", () => {
    // Conservative never offsets sells — always full sell amount
    expect(
      applyPostureAdjustment({
        baseRecommendation: -300,
        margin: -100,
        posture: Posture.Conservative,
      }),
    ).toBe(-300);
  });

  it("leaves sell recommendation unchanged when margin is positive", () => {
    expect(
      applyPostureAdjustment({
        baseRecommendation: -300,
        margin: 100,
        posture: Posture.Conservative,
      }),
    ).toBe(-300);
  });
});
