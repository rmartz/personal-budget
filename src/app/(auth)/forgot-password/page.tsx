"use client";

import { useState } from "react";
import { ForgotPasswordFormView } from "@/components/auth/ForgotPasswordForm";
import { sendPasswordReset } from "@/services/auth";

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-not-found":
      // Don't reveal whether the account exists — fall through to generic message
      return "An unexpected error occurred. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
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
      setError(getAuthErrorMessage(code));
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
