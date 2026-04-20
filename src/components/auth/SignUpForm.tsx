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
import { SIGN_UP_FORM_COPY } from "./SignUpForm.copy";

export interface SignUpFormViewProps {
  isLoading: boolean;
  error: string | undefined;
  onSubmit: (email: string, password: string) => void | Promise<void>;
}

export function SignUpFormView({
  isLoading,
  error,
  onSubmit,
}: SignUpFormViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >();

  function validate(): boolean {
    let valid = true;

    if (!email.trim()) {
      setEmailError(SIGN_UP_FORM_COPY.errorEmailRequired);
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(SIGN_UP_FORM_COPY.errorEmailInvalid);
      valid = false;
    } else {
      setEmailError(undefined);
    }

    if (!password) {
      setPasswordError(SIGN_UP_FORM_COPY.errorPasswordRequired);
      valid = false;
    } else if (password.length < 8) {
      setPasswordError(SIGN_UP_FORM_COPY.errorPasswordTooShort);
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    if (!confirmPassword) {
      setConfirmPasswordError(SIGN_UP_FORM_COPY.errorConfirmPasswordRequired);
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(SIGN_UP_FORM_COPY.errorPasswordMismatch);
      valid = false;
    } else {
      setConfirmPasswordError(undefined);
    }

    return valid;
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (validate()) {
      void onSubmit(email.trim(), password);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{SIGN_UP_FORM_COPY.title}</CardTitle>
        <CardDescription>{SIGN_UP_FORM_COPY.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sign-up-email">{SIGN_UP_FORM_COPY.emailLabel}</Label>
            <Input
              id="sign-up-email"
              type="email"
              autoComplete="email"
              placeholder={SIGN_UP_FORM_COPY.emailPlaceholder}
              value={email}
              onChange={(e) => { setEmail(e.target.value); }}
              aria-invalid={emailError !== undefined}
              aria-describedby={emailError ? "sign-up-email-error" : undefined}
              disabled={isLoading}
            />
            {emailError && (
              <p
                id="sign-up-email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {emailError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sign-up-password">
              {SIGN_UP_FORM_COPY.passwordLabel}
            </Label>
            <Input
              id="sign-up-password"
              type="password"
              autoComplete="new-password"
              placeholder={SIGN_UP_FORM_COPY.passwordPlaceholder}
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              aria-invalid={passwordError !== undefined}
              aria-describedby={
                passwordError ? "sign-up-password-error" : undefined
              }
              disabled={isLoading}
            />
            {passwordError && (
              <p
                id="sign-up-password-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sign-up-confirm-password">
              {SIGN_UP_FORM_COPY.confirmPasswordLabel}
            </Label>
            <Input
              id="sign-up-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder={SIGN_UP_FORM_COPY.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); }}
              aria-invalid={confirmPasswordError !== undefined}
              aria-describedby={
                confirmPasswordError
                  ? "sign-up-confirm-password-error"
                  : undefined
              }
              disabled={isLoading}
            />
            {confirmPasswordError && (
              <p
                id="sign-up-confirm-password-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {confirmPasswordError}
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
              ? SIGN_UP_FORM_COPY.loadingButton
              : SIGN_UP_FORM_COPY.submitButton}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center gap-1 text-sm">
        <span className="text-muted-foreground">
          {SIGN_UP_FORM_COPY.signInPrompt}
        </span>
        <Link
          href="/sign-in"
          className="font-medium underline-offset-4 hover:underline"
        >
          {SIGN_UP_FORM_COPY.signInLink}
        </Link>
      </CardFooter>
    </Card>
  );
}
