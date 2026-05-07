import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(getClientAuth(), email, password);
}

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(getClientAuth(), email, password);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(getClientAuth(), email);
}

export async function signOut() {
  return firebaseSignOut(getClientAuth());
}

export async function updateDisplayName(user: User, displayName: string) {
  return firebaseUpdateProfile(user, { displayName });
}

export async function updateEmail(user: User, newEmail: string) {
  return firebaseUpdateEmail(user, newEmail);
}

export async function updatePassword(
  user: User,
  currentPassword: string,
  newPassword: string,
) {
  if (!user.email) {
    throw new Error(
      "Password change is unavailable because this account has no email address.",
    );
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  return firebaseUpdatePassword(user, newPassword);
}
