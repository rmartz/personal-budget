import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LandingPage } from "./LandingPage";
import { LANDING_PAGE_COPY } from "./LandingPage.copy";

afterEach(cleanup);

describe("LandingPage", () => {
  describe("service description", () => {
    it("renders the main heading", () => {
      render(<LandingPage />);
      expect(
        screen.getByRole("heading", { name: LANDING_PAGE_COPY.heading }),
      ).toBeDefined();
    });

    it("renders the service description text", () => {
      render(<LandingPage />);
      expect(screen.getByText(LANDING_PAGE_COPY.description)).toBeDefined();
    });
  });

  describe("Sign in CTA", () => {
    it("renders a Sign in link pointing to /sign-in", () => {
      render(<LandingPage />);
      const link = screen.getByRole("link", {
        name: LANDING_PAGE_COPY.signInButton,
      });
      expect(link).toBeDefined();
      expect((link as HTMLAnchorElement).getAttribute("href")).toBe("/sign-in");
    });
  });

  describe("Create account CTA", () => {
    it("renders a Create account link pointing to /sign-up", () => {
      render(<LandingPage />);
      const link = screen.getByRole("link", {
        name: LANDING_PAGE_COPY.createAccountButton,
      });
      expect(link).toBeDefined();
      expect((link as HTMLAnchorElement).getAttribute("href")).toBe("/sign-up");
    });
  });
});
