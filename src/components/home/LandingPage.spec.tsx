import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LandingPage } from "./LandingPage";
import { LANDING_PAGE_COPY } from "./LandingPage.copy";
import { PUBLIC_HEADER_COPY } from "./PublicHeader.copy";

afterEach(cleanup);

describe("LandingPage — hero block", () => {
  it("renders the headline", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("heading", { name: LANDING_PAGE_COPY.headline }),
    ).toBeDefined();
  });

  it("renders the tagline", () => {
    render(<LandingPage />);
    expect(screen.getByText(LANDING_PAGE_COPY.tagline)).toBeDefined();
  });
});

describe("LandingPage — CTA", () => {
  it("renders a primary CTA link in the main content pointing to /sign-up", () => {
    render(<LandingPage />);
    const link = within(screen.getByRole("main")).getByRole("link", {
      name: LANDING_PAGE_COPY.primaryCta,
    });
    expect(link.getAttribute("href")).toBe("/sign-up");
  });
});

describe("LandingPage — public header", () => {
  it("renders the brand wordmark in the header", () => {
    render(<LandingPage />);
    expect(screen.getByText(PUBLIC_HEADER_COPY.brand)).toBeDefined();
  });

  it("renders a Sign in link pointing to /sign-in", () => {
    render(<LandingPage />);
    const link = screen
      .getAllByRole("link", { name: PUBLIC_HEADER_COPY.navSignIn })
      .find((el) => el.getAttribute("href") === "/sign-in");
    expect(link).toBeDefined();
  });

  it("renders a Get started link pointing to /sign-up", () => {
    render(<LandingPage />);
    const link = screen
      .getAllByRole("link", { name: PUBLIC_HEADER_COPY.navGetStarted })
      .find((el) => el.getAttribute("href") === "/sign-up");
    expect(link).toBeDefined();
  });
});
