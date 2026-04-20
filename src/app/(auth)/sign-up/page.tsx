"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpFormView } from "@/components/auth/SignUpForm";
import { signUp } from "@/services/auth";

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";
    case "auth/operation-not-allowed":
      return "Email/password sign-up is not enabled. Please contact support.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(email: string, password: string) {
    setIsLoading(true);
    setError(undefined);
    try {
      await signUp(email, password);
      router.push("/");
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
    <SignUpFormView
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
