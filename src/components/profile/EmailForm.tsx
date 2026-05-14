"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { USER_PROFILE_COPY } from "./copy";

export interface EmailFormProps {
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export function EmailForm({
  value,
  error,
  onChange,
  onSubmit,
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <div className="flex flex-col gap-1">
        <Label htmlFor="profile-email">
          {USER_PROFILE_COPY.changeEmailLabel}
        </Label>
        <Input
          id="profile-email"
          type="email"
          autoComplete="email"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          aria-invalid={error !== undefined}
          aria-describedby={
            error !== undefined ? "profile-email-error" : undefined
          }
        />
        {error !== undefined && (
          <p
            id="profile-email-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </p>
        )}
      </div>
      <Button type="submit" className="self-end">
        {USER_PROFILE_COPY.changeEmailButton}
      </Button>
    </form>
  );
}
