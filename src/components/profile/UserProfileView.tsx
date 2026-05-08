"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { USER_PROFILE_COPY } from "./copy";
import { DisplayNameForm } from "./DisplayNameForm";
import { EmailForm } from "./EmailForm";
import { PasswordForm } from "./PasswordForm";

export interface UserProfileViewProps {
  displayName: string;
  email: string;
  displayNameError?: string;
  emailError?: string;
  passwordError?: string;
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
  displayNameError: initialDisplayNameError,
  emailError: initialEmailError,
  passwordError: initialPasswordError,
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
    initialDisplayNameError,
  );
  const [emailError, setEmailError] = useState<string | undefined>(
    initialEmailError,
  );
  const [passwordError, setPasswordError] = useState<string | undefined>(
    initialPasswordError,
  );

  useEffect(() => {
    setDisplayNameValue(displayName);
  }, [displayName]);

  useEffect(() => {
    setEmailValue(email);
  }, [email]);

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

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        {USER_PROFILE_COPY.title}
      </h1>

      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {USER_PROFILE_COPY.profileSectionTitle}
        </h2>
        <DisplayNameForm
          value={displayNameValue}
          error={displayNameError}
          onChange={setDisplayNameValue}
          onSubmit={(e) => {
            e.preventDefault();
            void submitDisplayName();
          }}
        />
      </section>

      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {USER_PROFILE_COPY.emailSectionTitle}
        </h2>
        <EmailForm
          value={emailValue}
          error={emailError}
          onChange={setEmailValue}
          onSubmit={(e) => {
            e.preventDefault();
            void submitEmail();
          }}
        />
      </section>

      <section className="mb-8 flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {USER_PROFILE_COPY.passwordSectionTitle}
        </h2>
        <PasswordForm
          currentPassword={currentPassword}
          newPassword={newPassword}
          error={passwordError}
          onCurrentPasswordChange={setCurrentPassword}
          onNewPasswordChange={setNewPassword}
          onSubmit={(e) => {
            e.preventDefault();
            void submitPassword();
          }}
        />
      </section>

      <Button variant="outline" onClick={() => void onSignOut()}>
        {USER_PROFILE_COPY.signOutButton}
      </Button>
    </div>
  );
}
