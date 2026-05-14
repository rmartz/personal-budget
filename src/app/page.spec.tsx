import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LANDING_PAGE_COPY } from "@/components/home/LandingPage.copy";

import Home from "./page";

afterEach(cleanup);

describe("Home", () => {
  it("renders the landing page heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: LANDING_PAGE_COPY.headline }),
    ).toBeDefined();
  });
});
