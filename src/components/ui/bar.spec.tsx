import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Bar } from "./bar";

afterEach(cleanup);

describe("BarProps accepts an aria-label forwarded to the progressbar element", () => {
  it("renders a progressbar with the given aria-label", () => {
    render(
      <Bar value={50} aria-label="Cash cap usage for Everyday Spending" />,
    );
    const bar = screen.getByRole("progressbar", {
      name: "Cash cap usage for Everyday Spending",
    });
    expect(bar).toBeDefined();
  });

  it("renders a progressbar without an accessible name when aria-label is omitted", () => {
    render(<Bar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-label")).toBeNull();
  });
});
