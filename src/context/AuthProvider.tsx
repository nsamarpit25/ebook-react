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

interface Props {
  children: ReactNode;
}

export interface IAuthContext {
  profile: AuthState["profile"];
  status: AuthState["status"];
  signOut(): void;
  dbConnectionStatus: boolean;
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

  const signOut = async () => {
    try {
      dispatch(updateAuthStatus("busy"));
      await client.post("/auth/logout");
      dispatch(updateAuthStatus("unauthenticated"));
      dispatch(updateProfile(null));
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
        if (data instanceof AxiosError) {
          if (data.status === 503) {
            console.log("error");
            setDbConnectionStatus(false);
          }
        }

        dispatch(updateProfile(null));
        dispatch(updateAuthStatus("unauthenticated"));
      });
  }, [dispatch]);

  // if (status === "busy") return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ profile, status, signOut, dbConnectionStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
