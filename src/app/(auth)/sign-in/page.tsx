"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInFormView } from "@/components/auth/SignInForm";
import { signIn } from "@/services/auth";

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email address or password is incorrect. Please try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(email: string, password: string) {
    setIsLoading(true);
    setError(undefined);
    try {
      await signIn(email, password);
      const next = searchParams.get("next") ?? "/";
      router.push(next);
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
    <SignInFormView
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
