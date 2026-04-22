import { describe, it, expect, vi, beforeEach } from "vitest";
import { signIn, signUp, sendPasswordReset, signOut } from "./auth";

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/lib/firebase/client", () => ({
  getClientAuth: vi.fn(() => ({ type: "mock-auth" })),
}));

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

describe("auth service", () => {
  const mockAuth = { type: "mock-auth" };
  const email = "test@example.com";
  const password = "password123";

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
});
