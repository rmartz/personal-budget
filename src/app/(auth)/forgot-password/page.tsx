"use client";

import { useState } from "react";
import { ForgotPasswordFormView } from "@/components/auth/ForgotPasswordForm";
import { FORGOT_PASSWORD_FORM_COPY } from "@/components/auth/ForgotPasswordForm.copy";
import { sendPasswordReset } from "@/services/auth";

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return FORGOT_PASSWORD_FORM_COPY.errorInvalidEmail;
    default:
      return FORGOT_PASSWORD_FORM_COPY.errorDefault;
  }
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(email: string) {
    setIsLoading(true);
    setError(undefined);
    try {
      await sendPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      const code =
        err !== null &&
        typeof err === "object" &&
        "code" in err &&
        typeof err.code === "string"
          ? err.code
          : "";
      if (code === "auth/user-not-found") {
        setIsSubmitted(true);
      } else {
        setError(getAuthErrorMessage(code));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ForgotPasswordFormView
      isLoading={isLoading}
      isSubmitted={isSubmitted}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
