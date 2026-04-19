import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { AuthContext } from "@/components/auth";
import { useAuth } from "./use-auth";
import type { AuthContextValue } from "@/components/auth";

describe("useAuth", () => {
  it("returns the AuthContext value provided by the nearest AuthContext.Provider", () => {
    const contextValue: AuthContextValue = {
      user: { uid: "uid-123" } as never,
      loading: false,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(AuthContext.Provider, { value: contextValue }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBe(contextValue.user);
    expect(result.current.loading).toBe(false);
  });

  it("returns the default context value when no provider is present", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
