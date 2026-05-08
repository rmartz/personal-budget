"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_PROFILE_COPY } from "./copy";

export interface PasswordFormProps {
  currentPassword: string;
  newPassword: string;
  error: string | undefined;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export function PasswordForm({
  currentPassword,
  newPassword,
  error,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onSubmit,
}: PasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
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
            onCurrentPasswordChange(e.target.value);
          }}
          aria-invalid={error !== undefined}
          aria-describedby={
            error !== undefined ? "profile-password-error" : undefined
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
            onNewPasswordChange(e.target.value);
          }}
          aria-invalid={error !== undefined}
          aria-describedby={
            error !== undefined ? "profile-password-error" : undefined
          }
        />
      </div>
      {error !== undefined && (
        <p
          id="profile-password-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Button type="submit" className="self-end">
        {USER_PROFILE_COPY.changePasswordButton}
      </Button>
    </form>
  );
}
