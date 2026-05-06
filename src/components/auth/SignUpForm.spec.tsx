import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { SignUpFormView } from "./SignUpForm";
import { SIGN_UP_FORM_COPY } from "./SignUpForm.copy";

afterEach(cleanup);

describe("SignUpFormView", () => {
  describe("default state", () => {
    it("renders the form title", () => {
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(SIGN_UP_FORM_COPY.title)).toBeDefined();
    });

    it("renders the submit button with create account label", () => {
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(SIGN_UP_FORM_COPY.submitButton)).toBeDefined();
    });

    it("renders the sign-in link", () => {
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(SIGN_UP_FORM_COPY.signInLink)).toBeDefined();
    });
  });

  describe("loading state", () => {
    it("renders the loading button label", () => {
      render(
        <SignUpFormView
          isLoading={true}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(SIGN_UP_FORM_COPY.loadingButton)).toBeDefined();
    });
  });

  describe("error state", () => {
    it("renders the firebase error message", () => {
      const errorMessage = "An account with this email already exists.";
      render(
        <SignUpFormView
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
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      fireEvent.submit(
        screen.getByText(SIGN_UP_FORM_COPY.submitButton).closest("form")!,
      );
      expect(
        screen.getByText(SIGN_UP_FORM_COPY.errorEmailRequired),
      ).toBeDefined();
    });

    it("shows password too short error when password is fewer than 8 characters", () => {
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      fireEvent.change(
        screen.getByPlaceholderText(SIGN_UP_FORM_COPY.emailPlaceholder),
        { target: { value: "user@example.com" } },
      );
      fireEvent.change(screen.getByLabelText(SIGN_UP_FORM_COPY.passwordLabel), {
        target: { value: "short" },
      });
      fireEvent.submit(
        screen
          .getByPlaceholderText(SIGN_UP_FORM_COPY.emailPlaceholder)
          .closest("form")!,
      );
      expect(
        screen.getByText(SIGN_UP_FORM_COPY.errorPasswordTooShort),
      ).toBeDefined();
    });

    it("shows password mismatch error when passwords do not match", () => {
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      fireEvent.change(
        screen.getByPlaceholderText(SIGN_UP_FORM_COPY.emailPlaceholder),
        { target: { value: "user@example.com" } },
      );
      fireEvent.change(screen.getByLabelText(SIGN_UP_FORM_COPY.passwordLabel), {
        target: { value: "password123" },
      });
      fireEvent.change(
        screen.getByLabelText(SIGN_UP_FORM_COPY.confirmPasswordLabel),
        {
          target: { value: "different123" },
        },
      );
      fireEvent.submit(
        screen
          .getByPlaceholderText(SIGN_UP_FORM_COPY.emailPlaceholder)
          .closest("form")!,
      );
      expect(
        screen.getByText(SIGN_UP_FORM_COPY.errorPasswordMismatch),
      ).toBeDefined();
    });

    it("does not call onSubmit when validation fails", () => {
      const onSubmit = vi.fn();
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.submit(
        screen.getByText(SIGN_UP_FORM_COPY.submitButton).closest("form")!,
      );
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit with email and password when form is valid", () => {
      const onSubmit = vi.fn();
      render(
        <SignUpFormView
          isLoading={false}
          error={undefined}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByPlaceholderText(SIGN_UP_FORM_COPY.emailPlaceholder),
        { target: { value: "user@example.com" } },
      );
      fireEvent.change(screen.getByLabelText(SIGN_UP_FORM_COPY.passwordLabel), {
        target: { value: "password123" },
      });
      fireEvent.change(
        screen.getByLabelText(SIGN_UP_FORM_COPY.confirmPasswordLabel),
        {
          target: { value: "password123" },
        },
      );
      fireEvent.submit(
        screen
          .getByPlaceholderText(SIGN_UP_FORM_COPY.emailPlaceholder)
          .closest("form")!,
      );
      expect(onSubmit).toHaveBeenCalledWith("user@example.com", "password123");
    });
  });
});
