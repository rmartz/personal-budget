"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FORGOT_PASSWORD_FORM_COPY } from "./ForgotPasswordForm.copy";

export interface ForgotPasswordFormViewProps {
  isLoading: boolean;
  isSubmitted: boolean;
  error: string | undefined;
  onSubmit: (email: string) => void | Promise<void>;
}

export function ForgotPasswordFormView({
  isLoading,
  isSubmitted,
  error,
  onSubmit,
}: ForgotPasswordFormViewProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();

  function validate(): boolean {
    if (!email.trim()) {
      setEmailError(FORGOT_PASSWORD_FORM_COPY.errorEmailRequired);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(FORGOT_PASSWORD_FORM_COPY.errorEmailInvalid);
      return false;
    }
    setEmailError(undefined);
    return true;
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (validate()) {
      void onSubmit(email.trim());
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{FORGOT_PASSWORD_FORM_COPY.confirmationTitle}</CardTitle>
          <CardDescription>
            {FORGOT_PASSWORD_FORM_COPY.confirmationDescription}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/sign-in"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            {FORGOT_PASSWORD_FORM_COPY.confirmationBackLink}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{FORGOT_PASSWORD_FORM_COPY.title}</CardTitle>
        <CardDescription>{FORGOT_PASSWORD_FORM_COPY.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="forgot-password-email">
              {FORGOT_PASSWORD_FORM_COPY.emailLabel}
            </Label>
            <Input
              id="forgot-password-email"
              type="email"
              autoComplete="email"
              placeholder={FORGOT_PASSWORD_FORM_COPY.emailPlaceholder}
              value={email}
              onChange={(e) => { setEmail(e.target.value); }}
              aria-invalid={emailError !== undefined}
              aria-describedby={
                emailError ? "forgot-password-email-error" : undefined
              }
              disabled={isLoading}
            />
            {emailError && (
              <p
                id="forgot-password-email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {emailError}
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className={cn(
                "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
              )}
            >
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? FORGOT_PASSWORD_FORM_COPY.loadingButton
              : FORGOT_PASSWORD_FORM_COPY.submitButton}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/sign-in"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {FORGOT_PASSWORD_FORM_COPY.backToSignInLink}
        </Link>
      </CardFooter>
    </Card>
  );
}
