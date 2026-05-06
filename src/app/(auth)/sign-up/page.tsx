"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpFormView } from "@/components/auth/SignUpForm";
import { SIGN_UP_FORM_COPY } from "@/components/auth/SignUpForm.copy";
import { signUp } from "@/services/auth";

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return SIGN_UP_FORM_COPY.errorEmailAlreadyInUse;
    case "auth/invalid-email":
      return SIGN_UP_FORM_COPY.errorInvalidEmail;
    case "auth/weak-password":
      return SIGN_UP_FORM_COPY.errorWeakPassword;
    case "auth/operation-not-allowed":
      return SIGN_UP_FORM_COPY.errorOperationNotAllowed;
    default:
      return SIGN_UP_FORM_COPY.errorDefault;
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
