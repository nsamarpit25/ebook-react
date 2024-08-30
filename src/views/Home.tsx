import { FC, useContext } from "react";
import { AuthContext } from "../contexy/AuthProvider";
import useAuth from "../hooks/useAuth";

interface Props {}

const Home: FC<Props> = () => {
  const authStatus = useAuth();
  console.log(authStatus);
  return <div>Home</div>;
};

export default Home;
