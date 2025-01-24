import { useContext } from "react";
import { AuthContext } from "./useAuthContext";
// import { AuthContext } from "../context/AuthProvider";

const useAuth = () => {
  const state = useContext(AuthContext);
  return state;
};

export default useAuth;
