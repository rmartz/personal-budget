import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PublicHeader } from "./PublicHeader";
import { PUBLIC_HEADER_COPY } from "./PublicHeader.copy";

afterEach(cleanup);

describe("PublicHeader — brand", () => {
  it("renders the Ledgerly wordmark", () => {
    render(<PublicHeader />);
    expect(screen.getByText(PUBLIC_HEADER_COPY.brand)).toBeDefined();
  });
});

describe("PublicHeader — navigation links", () => {
  it("renders a Sign in link pointing to /sign-in", () => {
    render(<PublicHeader />);
    const link = screen.getByRole("link", {
      name: PUBLIC_HEADER_COPY.navSignIn,
    });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).getAttribute("href")).toBe("/sign-in");
  });

  it("renders a Get started link pointing to /sign-up", () => {
    render(<PublicHeader />);
    const link = screen.getByRole("link", {
      name: PUBLIC_HEADER_COPY.navGetStarted,
    });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).getAttribute("href")).toBe("/sign-up");
  });
});
