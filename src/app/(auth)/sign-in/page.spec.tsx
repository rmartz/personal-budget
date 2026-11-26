import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SIGN_IN_FORM_COPY } from "@/components/auth/SignInForm.copy";
import { AUTHENTICATED_HOME_PATH } from "@/lib/auth-constants";

import SignInPage from "./page";

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const nav = vi.hoisted(() => ({ search: "" }));
const signIn = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(nav.search),
}));
vi.mock("@/services/auth", () => ({ signIn }));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  nav.search = "";
  signIn.mockResolvedValue(undefined);
});

function submitValidForm() {
  fireEvent.change(screen.getByLabelText(SIGN_IN_FORM_COPY.emailLabel), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText(SIGN_IN_FORM_COPY.passwordLabel), {
    target: { value: "correct-horse-battery" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: SIGN_IN_FORM_COPY.submitButton }),
  );
}

describe("SignInPage — redirect", () => {
  it("replaces the route with the dashboard when there is no next param", async () => {
    render(<SignInPage />);
    submitValidForm();
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith(AUTHENTICATED_HOME_PATH);
    });
  });

  it("replaces the route with a same-origin next param", async () => {
    nav.search = "next=%2Fgoals";
    render(<SignInPage />);
    submitValidForm();
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/goals");
    });
  });

  it("replaces the route with the dashboard for an off-site next param", async () => {
    nav.search = "next=%2F%2Fevil.example";
    render(<SignInPage />);
    submitValidForm();
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith(AUTHENTICATED_HOME_PATH);
    });
  });
});
