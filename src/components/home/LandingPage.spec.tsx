import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LandingPage } from "./LandingPage";
import { LANDING_PAGE_COPY } from "./LandingPage.copy";
import { PUBLIC_HEADER_COPY } from "./PublicHeader.copy";

afterEach(cleanup);

describe("LandingPage — hero block", () => {
  it("renders the eyebrow text", () => {
    render(<LandingPage />);
    expect(screen.getByText(LANDING_PAGE_COPY.eyebrow)).toBeDefined();
  });

  it("renders the headline", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("heading", { name: LANDING_PAGE_COPY.headline }),
    ).toBeDefined();
  });

  it("renders the body copy", () => {
    render(<LandingPage />);
    expect(screen.getByText(LANDING_PAGE_COPY.bodyCopy)).toBeDefined();
  });

  it("renders the placeholder block caption", () => {
    render(<LandingPage />);
    expect(
      screen.getByText(LANDING_PAGE_COPY.placeholderCaption),
    ).toBeDefined();
  });
});

describe("LandingPage — CTAs", () => {
  it("renders a Start free link pointing to /sign-up", () => {
    render(<LandingPage />);
    const link = screen.getByRole("link", {
      name: LANDING_PAGE_COPY.primaryCta,
    });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).getAttribute("href")).toBe("/sign-up");
  });

  it("renders a How it works button", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("button", { name: LANDING_PAGE_COPY.secondaryCta }),
    ).toBeDefined();
  });
});

describe("LandingPage — public header", () => {
  it("renders the Ledgerly wordmark in the header", () => {
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
