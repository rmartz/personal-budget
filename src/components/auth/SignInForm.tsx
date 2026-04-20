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
import { SIGN_IN_FORM_COPY } from "./SignInForm.copy";

export interface SignInFormViewProps {
  isLoading: boolean;
  error: string | undefined;
  onSubmit: (email: string, password: string) => void | Promise<void>;
}

export function SignInFormView({
  isLoading,
  error,
  onSubmit,
}: SignInFormViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  function validate(): boolean {
    let valid = true;

    if (!email.trim()) {
      setEmailError(SIGN_IN_FORM_COPY.errorEmailRequired);
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(SIGN_IN_FORM_COPY.errorEmailInvalid);
      valid = false;
    } else {
      setEmailError(undefined);
    }

    if (!password) {
      setPasswordError(SIGN_IN_FORM_COPY.errorPasswordRequired);
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    return valid;
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
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
        <CardTitle>{SIGN_IN_FORM_COPY.title}</CardTitle>
        <CardDescription>{SIGN_IN_FORM_COPY.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sign-in-email">{SIGN_IN_FORM_COPY.emailLabel}</Label>
            <Input
              id="sign-in-email"
              type="email"
              autoComplete="email"
              placeholder={SIGN_IN_FORM_COPY.emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
              aria-invalid={emailError !== undefined}
              aria-describedby={emailError ? "sign-in-email-error" : undefined}
              disabled={isLoading}
            />
            {emailError && (
              <p
                id="sign-in-email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {emailError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="sign-in-password">
                {SIGN_IN_FORM_COPY.passwordLabel}
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                {SIGN_IN_FORM_COPY.forgotPasswordLink}
              </Link>
            </div>
            <Input
              id="sign-in-password"
              type="password"
              autoComplete="current-password"
              placeholder={SIGN_IN_FORM_COPY.passwordPlaceholder}
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={passwordError !== undefined}
              aria-describedby={
                passwordError ? "sign-in-password-error" : undefined
              }
              disabled={isLoading}
            />
            {passwordError && (
              <p
                id="sign-in-password-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {passwordError}
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className={cn("rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive")}
            >
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? SIGN_IN_FORM_COPY.loadingButton
              : SIGN_IN_FORM_COPY.submitButton}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center gap-1 text-sm">
        <span className="text-muted-foreground">
          {SIGN_IN_FORM_COPY.signUpPrompt}
        </span>
        <Link
          href="/sign-up"
          className="font-medium underline-offset-4 hover:underline"
        >
          {SIGN_IN_FORM_COPY.signUpLink}
        </Link>
      </CardFooter>
    </Card>
  );
}
