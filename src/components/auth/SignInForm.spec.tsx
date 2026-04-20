import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { SignInFormView } from "./SignInForm";
import { SIGN_IN_FORM_COPY } from "./SignInForm.copy";

afterEach(cleanup);

describe("SignInFormView", () => {
  describe("default state", () => {
    it("renders the form title as a heading", () => {
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={vi.fn()} />,
      );
      expect(
        screen.getByRole("heading", { name: SIGN_IN_FORM_COPY.title }),
      ).toBeDefined();
    });

    it("renders the submit button with sign-in label", () => {
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: SIGN_IN_FORM_COPY.submitButton }),
      ).toBeDefined();
    });

    it("renders the forgot password link", () => {
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={vi.fn()} />,
      );
      expect(
        screen.getByText(SIGN_IN_FORM_COPY.forgotPasswordLink),
      ).toBeDefined();
    });

    it("renders the sign-up link", () => {
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={vi.fn()} />,
      );
      expect(screen.getByText(SIGN_IN_FORM_COPY.signUpLink)).toBeDefined();
    });
  });

  describe("loading state", () => {
    it("renders the loading button label", () => {
      render(
        <SignInFormView isLoading={true} error={undefined} onSubmit={vi.fn()} />,
      );
      expect(screen.getByText(SIGN_IN_FORM_COPY.loadingButton)).toBeDefined();
    });
  });

  describe("error state", () => {
    it("renders the firebase error message", () => {
      const errorMessage = "Invalid email or password.";
      render(
        <SignInFormView
          isLoading={false}
          error={errorMessage}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(errorMessage)).toBeDefined();
    });
  });

  describe("validation", () => {
    it("shows email required error when email is empty on submit", () => {
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={vi.fn()} />,
      );
      fireEvent.submit(screen.getByRole("button", { name: SIGN_IN_FORM_COPY.submitButton }).closest("form")!);
      expect(
        screen.getByText(SIGN_IN_FORM_COPY.errorEmailRequired),
      ).toBeDefined();
    });

    it("shows password required error when password is empty on submit", () => {
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={vi.fn()} />,
      );
      const emailInput = screen.getByPlaceholderText(
        SIGN_IN_FORM_COPY.emailPlaceholder,
      );
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.submit(emailInput.closest("form")!);
      expect(
        screen.getByText(SIGN_IN_FORM_COPY.errorPasswordRequired),
      ).toBeDefined();
    });

    it("does not call onSubmit when validation fails", () => {
      const onSubmit = vi.fn();
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={onSubmit} />,
      );
      fireEvent.submit(screen.getByRole("button", { name: SIGN_IN_FORM_COPY.submitButton }).closest("form")!);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit with email and password when form is valid", () => {
      const onSubmit = vi.fn();
      render(
        <SignInFormView isLoading={false} error={undefined} onSubmit={onSubmit} />,
      );
      fireEvent.change(
        screen.getByPlaceholderText(SIGN_IN_FORM_COPY.emailPlaceholder),
        { target: { value: "user@example.com" } },
      );
      fireEvent.change(
        screen.getByPlaceholderText(SIGN_IN_FORM_COPY.passwordPlaceholder),
        { target: { value: "password123" } },
      );
      fireEvent.submit(
        screen.getByPlaceholderText(SIGN_IN_FORM_COPY.emailPlaceholder).closest("form")!,
      );
      expect(onSubmit).toHaveBeenCalledWith("user@example.com", "password123");
    });
  });
});
