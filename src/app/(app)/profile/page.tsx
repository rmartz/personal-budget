"use client";

import { UserProfile } from "@/components/profile";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return <UserProfile user={user} />;
}
