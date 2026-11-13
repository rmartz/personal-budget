"use client";

import { Button } from "@/components/ui/button";

import { GOOGLE_SIGN_IN_COPY } from "./GoogleSignIn.copy";

export interface GoogleSignInProps {
  disabled: boolean;
  onGoogleSignIn: () => void | Promise<void>;
}

// The "Continue with Google" button and the divider that separates it from the
// email/password form below it.
export function GoogleSignIn({ disabled, onGoogleSignIn }: GoogleSignInProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled}
        onClick={() => void onGoogleSignIn()}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
          <path
            fill="#4285F4"
            d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.02c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
          />
        </svg>
        {GOOGLE_SIGN_IN_COPY.button}
      </Button>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {GOOGLE_SIGN_IN_COPY.divider}
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
