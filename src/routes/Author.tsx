import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface Props {}

const Author: FC<Props> = () => {
  const { profile } = useAuth();
  const isAuthor = profile?.role === "author";
  // console.log(status);

  return isAuthor ? <Outlet /> : <Navigate to="/not-found" />;
};

export default Author;
