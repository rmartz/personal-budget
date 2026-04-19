import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/components/auth";

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
