"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { getFirebaseErrorCode } from "@/components/auth/firebase-error-code";
import { getGoogleSignInErrorMessage } from "@/components/auth/google-sign-in-error";
import { SignInFormView } from "@/components/auth/SignInForm";
import { SIGN_IN_FORM_COPY } from "@/components/auth/SignInForm.copy";
import { signIn, signInWithGoogle } from "@/services/auth";

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
      setError(getAuthErrorMessage(getFirebaseErrorCode(err)));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(undefined);
    try {
      await signInWithGoogle();
      router.push(sanitizeNext(searchParams.get("next")));
    } catch (err) {
      setError(getGoogleSignInErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SignInFormView
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
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
