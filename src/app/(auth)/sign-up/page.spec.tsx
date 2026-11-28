import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SIGN_UP_FORM_COPY } from "@/components/auth/SignUpForm.copy";
import { AUTHENTICATED_HOME_PATH } from "@/lib/auth-constants";

import SignUpPage from "./page";

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const signUp = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/services/auth", () => ({ signUp }));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

function submitValidForm() {
  fireEvent.change(screen.getByLabelText(SIGN_UP_FORM_COPY.emailLabel), {
    target: { value: "new@example.com" },
  });
  fireEvent.change(screen.getByLabelText(SIGN_UP_FORM_COPY.passwordLabel), {
    target: { value: "correct-horse-battery" },
  });
  fireEvent.change(
    screen.getByLabelText(SIGN_UP_FORM_COPY.confirmPasswordLabel),
    { target: { value: "correct-horse-battery" } },
  );
  fireEvent.click(
    screen.getByRole("button", { name: SIGN_UP_FORM_COPY.submitButton }),
  );
}

describe("SignUpPage — redirect", () => {
  it("replaces the route with the dashboard after sign-up", async () => {
    signUp.mockResolvedValue(undefined);
    render(<SignUpPage />);
    submitValidForm();
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith(AUTHENTICATED_HOME_PATH);
    });
  });

  it("does not navigate when sign-up fails", async () => {
    signUp.mockRejectedValue({ code: "auth/email-already-in-use" });
    render(<SignUpPage />);
    submitValidForm();
    await screen.findByText(SIGN_UP_FORM_COPY.errorEmailAlreadyInUse);
    expect(router.replace).not.toHaveBeenCalled();
  });
});
