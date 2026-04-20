"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInFormView } from "@/components/auth/SignInForm";
import { SIGN_IN_FORM_COPY } from "@/components/auth/SignInForm.copy";
import { signIn } from "@/services/auth";

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return SIGN_IN_FORM_COPY.errorInvalidCredential;
    case "auth/user-disabled":
      return SIGN_IN_FORM_COPY.errorAccountDisabled;
    case "auth/too-many-requests":
      return SIGN_IN_FORM_COPY.errorTooManyRequests;
    default:
      return SIGN_IN_FORM_COPY.errorDefault;
  }
}

function sanitizeNext(raw: string | null): string {
  if (raw !== null && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(email: string, password: string) {
    setIsLoading(true);
    setError(undefined);
    try {
      await signIn(email, password);
      router.push(sanitizeNext(searchParams.get("next")));
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

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
