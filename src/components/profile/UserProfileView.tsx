"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_PROFILE_COPY } from "./copy";

export interface UserProfileViewProps {
  displayName: string;
  email: string;
  onUpdateDisplayName: (displayName: string) => Promise<void>;
  onUpdateEmail: (email: string) => Promise<void>;
  onUpdatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  onSignOut: () => Promise<void>;
}

export function UserProfileView({
  displayName,
  email,
  onUpdateDisplayName,
  onUpdateEmail,
  onUpdatePassword,
  onSignOut,
}: UserProfileViewProps) {
  const [displayNameValue, setDisplayNameValue] = useState(displayName);
  const [emailValue, setEmailValue] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [displayNameError, setDisplayNameError] = useState<string | undefined>(
    undefined,
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined,
  );

  async function submitDisplayName() {
    try {
      await onUpdateDisplayName(displayNameValue);
      setDisplayNameError(undefined);
    } catch (err) {
      setDisplayNameError(
        err instanceof Error ? err.message : USER_PROFILE_COPY.genericError,
      );
    }
  }

  async function submitEmail() {
    try {
      await onUpdateEmail(emailValue);
      setEmailError(undefined);
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : USER_PROFILE_COPY.genericError,
      );
    }
  }

  async function submitPassword() {
    try {
      await onUpdatePassword(currentPassword, newPassword);
      setPasswordError(undefined);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : USER_PROFILE_COPY.genericError,
      );
    }
  }

  function handleDisplayNameSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void submitDisplayName();
  }

  function handleEmailSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void submitEmail();
  }

  function handlePasswordSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void submitPassword();
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        {USER_PROFILE_COPY.title}
      </h1>

      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {USER_PROFILE_COPY.profileSectionTitle}
        </h2>
        <form
          onSubmit={handleDisplayNameSubmit}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="profile-display-name">
              {USER_PROFILE_COPY.displayNameLabel}
            </Label>
            <Input
              id="profile-display-name"
              type="text"
              value={displayNameValue}
              onChange={(e) => {
                setDisplayNameValue(e.target.value);
              }}
              aria-invalid={displayNameError !== undefined}
              aria-describedby={
                displayNameError ? "profile-display-name-error" : undefined
              }
            />
            {displayNameError !== undefined && (
              <p
                id="profile-display-name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {displayNameError}
              </p>
            )}
          </div>
          <Button type="submit" className="self-end">
            {USER_PROFILE_COPY.displayNameButton}
          </Button>
        </form>
      </section>

      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {USER_PROFILE_COPY.emailSectionTitle}
        </h2>
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="profile-email">
              {USER_PROFILE_COPY.changeEmailLabel}
            </Label>
            <Input
              id="profile-email"
              type="email"
              autoComplete="email"
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value);
              }}
              aria-invalid={emailError !== undefined}
              aria-describedby={emailError ? "profile-email-error" : undefined}
            />
            {emailError !== undefined && (
              <p
                id="profile-email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {emailError}
              </p>
            )}
          </div>
          <Button type="submit" className="self-end">
            {USER_PROFILE_COPY.changeEmailButton}
          </Button>
        </form>
      </section>

      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {USER_PROFILE_COPY.passwordSectionTitle}
        </h2>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="profile-current-password">
              {USER_PROFILE_COPY.changePasswordCurrentLabel}
            </Label>
            <Input
              id="profile-current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              aria-invalid={passwordError !== undefined}
              aria-describedby={
                passwordError ? "profile-password-error" : undefined
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="profile-new-password">
              {USER_PROFILE_COPY.changePasswordNewLabel}
            </Label>
            <Input
              id="profile-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              aria-invalid={passwordError !== undefined}
              aria-describedby={
                passwordError ? "profile-password-error" : undefined
              }
            />
          </div>
          {passwordError !== undefined && (
            <p
              id="profile-password-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {passwordError}
            </p>
          )}
          <Button type="submit" className="self-end">
            {USER_PROFILE_COPY.changePasswordButton}
          </Button>
        </form>
      </section>

      <Button
        variant="outline"
        onClick={() => {
          void onSignOut();
        }}
      >
        {USER_PROFILE_COPY.signOutButton}
      </Button>
    </div>
  );
}
