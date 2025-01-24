import { createContext } from "react";
import type { IAuthContext } from "../context/AuthProvider";

export const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
  signOut() {},
  dbConnectionStatus: false,
});
