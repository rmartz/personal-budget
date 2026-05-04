import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  signIn,
  signUp,
  sendPasswordReset,
  signOut,
  updateDisplayName,
  updateEmail as serviceUpdateEmail,
  updatePassword as serviceUpdatePassword,
} from "./auth";

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  updateEmail: vi.fn(),
  updatePassword: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
  EmailAuthProvider: {
    credential: vi.fn().mockReturnValue({ type: "mock-credential" }),
  },
}));

vi.mock("@/lib/firebase/client", () => ({
  getClientAuth: vi.fn(() => ({ type: "mock-auth" })),
}));

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

describe("auth service", () => {
  const mockAuth = { type: "mock-auth" };
  const email = "test@example.com";
  const password = "password123";
  const mockUser = { uid: "uid-1", email } as never;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientAuth).mockReturnValue(mockAuth as never);
  });

  describe("signIn", () => {
    it("calls signInWithEmailAndPassword with auth, email, and password", async () => {
      const mockResult = { user: { uid: "uid-1" } };
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(
        mockResult as never,
      );

      const result = await signIn(email, password);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        email,
        password,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe("signUp", () => {
    it("calls createUserWithEmailAndPassword with auth, email, and password", async () => {
      const mockResult = { user: { uid: "uid-2" } };
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(
        mockResult as never,
      );

      const result = await signUp(email, password);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        email,
        password,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe("sendPasswordReset", () => {
    it("calls sendPasswordResetEmail with auth and email", async () => {
      vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);

      await sendPasswordReset(email);

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, email);
    });
  });

  describe("signOut", () => {
    it("calls firebase signOut with auth", async () => {
      vi.mocked(firebaseSignOut).mockResolvedValue(undefined);

      await signOut();

      expect(firebaseSignOut).toHaveBeenCalledWith(mockAuth);
    });
  });

  describe("updateDisplayName", () => {
    it("calls updateProfile with the user and display name", async () => {
      vi.mocked(firebaseUpdateProfile).mockResolvedValue(undefined);

      await updateDisplayName(mockUser, "New Name");

      expect(firebaseUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: "New Name",
      });
    });
  });

  describe("updateEmail", () => {
    it("calls firebase updateEmail with the user and new email", async () => {
      vi.mocked(firebaseUpdateEmail).mockResolvedValue(undefined);

      await serviceUpdateEmail(mockUser, "new@example.com");

      expect(firebaseUpdateEmail).toHaveBeenCalledWith(
        mockUser,
        "new@example.com",
      );
    });
  });

  describe("updatePassword", () => {
    it("throws when user has no email address", async () => {
      const userWithoutEmail = { uid: "uid-1", email: null } as never;

      await expect(
        serviceUpdatePassword(userWithoutEmail, "current", "new"),
      ).rejects.toThrow("User does not have an email address");
    });

    it("re-authenticates then updates the password", async () => {
      vi.mocked(reauthenticateWithCredential).mockResolvedValue(
        undefined as never,
      );
      vi.mocked(firebaseUpdatePassword).mockResolvedValue(undefined);

      await serviceUpdatePassword(mockUser, password, "newPassword123");

      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        expect.anything(),
      );
      expect(firebaseUpdatePassword).toHaveBeenCalledWith(
        mockUser,
        "newPassword123",
      );
    });
  });
});
