import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Posture } from "@/lib/firebase/schema/investments";

import { POSTURE_CARD_COPY } from "./copy";
import { PostureCard } from "./PostureCard";

afterEach(cleanup);

describe("PostureCard — renders all posture options", () => {
  it("shows Conservative pill", () => {
    render(<PostureCard posture={Posture.Balanced} />);
    expect(
      screen.getByText(POSTURE_CARD_COPY.postureConservative),
    ).toBeDefined();
  });

  it("shows Balanced pill", () => {
    render(<PostureCard posture={Posture.Conservative} />);
    expect(screen.getByText(POSTURE_CARD_COPY.postureBalanced)).toBeDefined();
  });

  it("shows Aggressive pill", () => {
    render(<PostureCard posture={Posture.Conservative} />);
    expect(screen.getByText(POSTURE_CARD_COPY.postureAggressive)).toBeDefined();
  });
});

describe("PostureCard — active posture is highlighted", () => {
  it("marks the active posture pill with aria-current", () => {
    render(<PostureCard posture={Posture.Aggressive} />);
    const pill = screen.getByText(POSTURE_CARD_COPY.postureAggressive);
    expect(pill.getAttribute("aria-current")).toBe("true");
  });

  it("does not mark inactive posture pills with aria-current", () => {
    render(<PostureCard posture={Posture.Aggressive} />);
    const conservativePill = screen.getByText(
      POSTURE_CARD_COPY.postureConservative,
    );
    expect(conservativePill.getAttribute("aria-current")).toBeNull();
  });

  it("highlights Balanced when posture is Balanced", () => {
    render(<PostureCard posture={Posture.Balanced} />);
    const pill = screen.getByText(POSTURE_CARD_COPY.postureBalanced);
    expect(pill.getAttribute("aria-current")).toBe("true");
  });
});
