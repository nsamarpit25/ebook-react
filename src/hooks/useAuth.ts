import { useContext } from "react";
import { AuthContext } from "../contexy/AuthProvider";

const useAuth = () => {
  const state = useContext(AuthContext);
  return state;
};

export default useAuth;
