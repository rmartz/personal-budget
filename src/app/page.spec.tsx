import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "./page";
import { LANDING_PAGE_COPY } from "@/components/home/LandingPage.copy";

afterEach(cleanup);

describe("Home", () => {
  it("renders the landing page heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: LANDING_PAGE_COPY.heading }),
    ).toBeDefined();
  });
});
