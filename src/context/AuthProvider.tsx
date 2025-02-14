import { AxiosError } from "axios";
import { FC, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import client from "../api/client";
import { AuthContext } from "../hooks/useAuthContext";
import {
  AuthState,
  getAuthState,
  updateAuthStatus,
  updateProfile,
} from "../store/auth";
import Cookies from "js-cookie";

interface Props {
  children: ReactNode;
}

export interface IAuthContext {
  profile: AuthState["profile"];
  status: AuthState["status"];
  signOut(): void;
  dbConnectionStatus: boolean;
  serverConnectionStatus: boolean;
}

// export const AuthContext = createContext<IAuthContext>({
//   profile: null,
//   status: "unauthenticated",
//   signOut() {},
// });

const AuthProvider: FC<Props> = ({ children }) => {
  const { profile, status } = useSelector(getAuthState);
  const dispatch = useDispatch();
  const [dbConnectionStatus, setDbConnectionStatus] = useState(true);
  const [serverConnectionStatus, setServerConnectionStatus] = useState(true);

  const signOut = async () => {
    try {
      dispatch(updateAuthStatus("busy"));
      await client.post("/auth/logout");
      dispatch(updateAuthStatus("unauthenticated"));
      dispatch(updateProfile(null));
      Cookies.remove("authToken", { path: "/" });
    } catch (error) {
      console.error(error);
      dispatch(updateAuthStatus("authenticated"));
    }
  };

  useEffect(() => {
    dispatch(updateAuthStatus("busy"));
    client
      .get("/auth/profile")
      .then(({ data }) => {
        dispatch(updateProfile(data.profile));
        dispatch(updateAuthStatus("authenticated"));
        // console.log(profile)
      })
      .catch((data) => {
        // console.log(data.code);
        if (data instanceof AxiosError) {
          if (data.status === 503) {
            // console.log("error");
            setDbConnectionStatus(false);
          }
          if (data.code === "ERR_NETWORK") {
            setServerConnectionStatus(false);
          }
        }

        dispatch(updateProfile(null));
        dispatch(updateAuthStatus("unauthenticated"));
      });
  }, [dispatch]);

  // if (status === "busy") return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        profile,
        status,
        signOut,
        dbConnectionStatus,
        serverConnectionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
