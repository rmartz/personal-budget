"use client";

import { useRouter } from "next/navigation";
import { ProfileSettingsView } from "@/components/profile";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/services/auth";

function deriveInitials(displayName: string, email: string): string {
  if (displayName.trim() !== "") {
    const words = displayName.trim().split(/\s+/);
    return words
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email[0]?.toUpperCase() ?? "";
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    return null;
  }

  const displayName = user.displayName ?? "";
  const email = user.email ?? "";
  const initials = deriveInitials(displayName, email);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } finally {
      await signOut();
      router.push("/sign-in");
    }
  }

  return (
    <ProfileSettingsView
      displayName={displayName}
      email={email}
      initials={initials}
      onSignOut={() => void handleSignOut()}
    />
  );
}
