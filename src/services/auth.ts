import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile as firebaseUpdateProfile,
  type User,
} from "firebase/auth";

import { getClientAuth } from "@/lib/firebase/client";

// Exchange the freshly-signed-in user's ID token for the httpOnly session
// cookie the middleware reads. Client Firebase auth alone leaves the server
// unaware the user is signed in, so this must run before any navigation into a
// middleware-gated route.
async function establishServerSession(user: User): Promise<void> {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    throw new Error("Failed to establish session");
  }
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    getClientAuth(),
    email,
    password,
  );
  await establishServerSession(credential.user);
  return credential;
}

export async function signUp(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    getClientAuth(),
    email,
    password,
  );
  await establishServerSession(credential.user);
  return credential;
}

// Signs in, or creates the account on first use. A popup rather than a
// redirect: the redirect flow loses its result under third-party storage
// partitioning (Safari, Chrome) whenever `authDomain` (*.firebaseapp.com)
// differs from the app's own host.
export async function signInWithGoogle() {
  const credential = await signInWithPopup(
    getClientAuth(),
    new GoogleAuthProvider(),
  );
  await establishServerSession(credential.user);
  return credential;
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
