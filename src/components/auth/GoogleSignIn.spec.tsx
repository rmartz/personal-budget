import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GoogleSignIn } from "./GoogleSignIn";
import { GOOGLE_SIGN_IN_COPY } from "./GoogleSignIn.copy";

afterEach(cleanup);

describe("GoogleSignIn", () => {
  it("renders the Continue with Google button", () => {
    render(<GoogleSignIn disabled={false} onGoogleSignIn={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: GOOGLE_SIGN_IN_COPY.button }),
    ).toBeDefined();
  });

  it("calls onGoogleSignIn when clicked", () => {
    const onGoogleSignIn = vi.fn();
    render(<GoogleSignIn disabled={false} onGoogleSignIn={onGoogleSignIn} />);
    fireEvent.click(
      screen.getByRole("button", { name: GOOGLE_SIGN_IN_COPY.button }),
    );
    expect(onGoogleSignIn).toHaveBeenCalledOnce();
  });

  it("disables the button when disabled", () => {
    render(<GoogleSignIn disabled={true} onGoogleSignIn={vi.fn()} />);
    expect(
      screen
        .getByRole("button", { name: GOOGLE_SIGN_IN_COPY.button })
        .hasAttribute("disabled"),
    ).toBe(true);
  });
});
