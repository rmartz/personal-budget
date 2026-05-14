"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { USER_PROFILE_COPY } from "./copy";

export interface DisplayNameFormProps {
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export function DisplayNameForm({
  value,
  error,
  onChange,
  onSubmit,
}: DisplayNameFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <div className="flex flex-col gap-1">
        <Label htmlFor="profile-display-name">
          {USER_PROFILE_COPY.displayNameLabel}
        </Label>
        <Input
          id="profile-display-name"
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          aria-invalid={error !== undefined}
          aria-describedby={
            error !== undefined ? "profile-display-name-error" : undefined
          }
        />
        {error !== undefined && (
          <p
            id="profile-display-name-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </p>
        )}
      </div>
      <Button type="submit" className="self-end">
        {USER_PROFILE_COPY.displayNameButton}
      </Button>
    </form>
  );
}
