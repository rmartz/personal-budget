"use client";

import { Card } from "@/components/ui/card";

import { PROFILE_SETTINGS_COPY } from "./copy";

export interface ProfileSettingsViewProps {
  displayName: string;
  email: string;
  initials: string;
  onSignOut: () => void;
}

interface SettingsRowProps {
  label: string;
  value?: string;
  onClick: () => void;
}

function SettingsRow({ label, value, onClick }: SettingsRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-muted/50"
    >
      <span>{label}</span>
      <span className="flex items-center gap-2 text-muted-foreground">
        {value !== undefined && <span>{value}</span>}
        <span aria-hidden="true">›</span>
      </span>
    </button>
  );
}

export function ProfileSettingsView({
  displayName,
  email,
  initials,
  onSignOut,
}: ProfileSettingsViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {PROFILE_SETTINGS_COPY.title}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Identity card */}
        <Card className="flex flex-col items-center gap-3 p-6">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">
            {PROFILE_SETTINGS_COPY.accountEyebrow}
          </p>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="text-center">
            <p className="font-semibold">{displayName}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </Card>

        {/* Settings list */}
        <Card className="overflow-hidden divide-y">
          <SettingsRow
            label={PROFILE_SETTINGS_COPY.rowDisplayName}
            onClick={() => {
              // TODO: user preferences epic
            }}
          />
          <SettingsRow
            label={PROFILE_SETTINGS_COPY.rowChangePassword}
            onClick={() => {
              // TODO: user preferences epic
            }}
          />
          <SettingsRow
            label={PROFILE_SETTINGS_COPY.rowCurrency}
            value={PROFILE_SETTINGS_COPY.currencyDefault}
            onClick={() => {
              // TODO: user preferences epic
            }}
          />
          <SettingsRow
            label={PROFILE_SETTINGS_COPY.rowTimeZone}
            onClick={() => {
              // TODO: user preferences epic
            }}
          />
          <SettingsRow
            label={PROFILE_SETTINGS_COPY.rowNotifications}
            onClick={() => {
              // TODO: user preferences epic
            }}
          />
          <SettingsRow
            label={PROFILE_SETTINGS_COPY.rowSignOut}
            onClick={onSignOut}
          />
        </Card>
      </div>
    </div>
  );
}
