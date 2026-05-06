import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ForgotPasswordFormView } from "./ForgotPasswordForm";
import { FORGOT_PASSWORD_FORM_COPY } from "./ForgotPasswordForm.copy";

afterEach(cleanup);

describe("ForgotPasswordFormView", () => {
  describe("default state", () => {
    it("renders the form title", () => {
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(screen.getByText(FORGOT_PASSWORD_FORM_COPY.title)).toBeDefined();
    });

    it("renders the submit button", () => {
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(FORGOT_PASSWORD_FORM_COPY.submitButton),
      ).toBeDefined();
    });

    it("renders the back to sign in link", () => {
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(FORGOT_PASSWORD_FORM_COPY.backToSignInLink),
      ).toBeDefined();
    });
  });

  describe("loading state", () => {
    it("renders the loading button label", () => {
      render(
        <ForgotPasswordFormView
          isLoading={true}
          isSubmitted={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(FORGOT_PASSWORD_FORM_COPY.loadingButton),
      ).toBeDefined();
    });
  });

  describe("submitted state", () => {
    it("renders the confirmation title", () => {
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={true}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(FORGOT_PASSWORD_FORM_COPY.confirmationTitle),
      ).toBeDefined();
    });

    it("renders the confirmation description", () => {
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={true}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(FORGOT_PASSWORD_FORM_COPY.confirmationDescription),
      ).toBeDefined();
    });

    it("does not render the email input", () => {
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={true}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      expect(
        screen.queryByPlaceholderText(
          FORGOT_PASSWORD_FORM_COPY.emailPlaceholder,
        ),
      ).toBeNull();
    });
  });

  describe("error state", () => {
    it("renders the error message", () => {
      const errorMessage = "An unexpected error occurred.";
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
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
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
          error={undefined}
          onSubmit={vi.fn()}
        />,
      );
      fireEvent.submit(
        screen
          .getByText(FORGOT_PASSWORD_FORM_COPY.submitButton)
          .closest("form")!,
      );
      expect(
        screen.getByText(FORGOT_PASSWORD_FORM_COPY.errorEmailRequired),
      ).toBeDefined();
    });

    it("does not call onSubmit when validation fails", () => {
      const onSubmit = vi.fn();
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
          error={undefined}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.submit(
        screen
          .getByText(FORGOT_PASSWORD_FORM_COPY.submitButton)
          .closest("form")!,
      );
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit with email when form is valid", () => {
      const onSubmit = vi.fn();
      render(
        <ForgotPasswordFormView
          isLoading={false}
          isSubmitted={false}
          error={undefined}
          onSubmit={onSubmit}
        />,
      );
      fireEvent.change(
        screen.getByPlaceholderText(FORGOT_PASSWORD_FORM_COPY.emailPlaceholder),
        { target: { value: "user@example.com" } },
      );
      fireEvent.submit(
        screen
          .getByPlaceholderText(FORGOT_PASSWORD_FORM_COPY.emailPlaceholder)
          .closest("form")!,
      );
      expect(onSubmit).toHaveBeenCalledWith("user@example.com");
    });
  });
});
