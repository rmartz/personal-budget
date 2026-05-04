"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  function handleDisplayNameSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void onUpdateDisplayName(displayNameValue);
  }

  function handleEmailSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void onUpdateEmail(emailValue);
  }

  function handlePasswordSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void onUpdatePassword(currentPassword, newPassword).then(() => {
      setCurrentPassword("");
      setNewPassword("");
    });
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
            <label
              htmlFor="display-name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {USER_PROFILE_COPY.displayNameLabel}
            </label>
            <input
              id="display-name"
              type="text"
              value={displayNameValue}
              onChange={(e) => {
                setDisplayNameValue(e.target.value);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
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
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {USER_PROFILE_COPY.changeEmailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
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
            <label
              htmlFor="current-password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {USER_PROFILE_COPY.changePasswordCurrentLabel}
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {USER_PROFILE_COPY.changePasswordNewLabel}
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
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
