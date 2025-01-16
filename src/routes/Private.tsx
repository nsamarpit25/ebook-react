import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Props {}

const Private: FC<Props> = () => {
  const { status } = useAuth();
  const notLoggedIn = status === "unauthenticated";
  console.log(status);

  if (status === "busy") return <LoadingSpinner />;

  return notLoggedIn ? <Navigate to="/sign-up" /> : <Outlet />;
};

export default Private;
