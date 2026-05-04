"use client";

import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import {
  updateDisplayName,
  updateEmail,
  updatePassword,
  signOut,
} from "@/services/auth";
import { UserProfileView } from "./UserProfileView";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();

  async function handleUpdateDisplayName(displayName: string) {
    await updateDisplayName(user, displayName);
  }

  async function handleUpdateEmail(email: string) {
    await updateEmail(user, email);
  }

  async function handleUpdatePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    await updatePassword(user, currentPassword, newPassword);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <UserProfileView
      displayName={user.displayName ?? ""}
      email={user.email ?? ""}
      onUpdateDisplayName={handleUpdateDisplayName}
      onUpdateEmail={handleUpdateEmail}
      onUpdatePassword={handleUpdatePassword}
      onSignOut={handleSignOut}
    />
  );
}
