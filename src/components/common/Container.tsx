import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "./Navbar";
import ConnectionError from "./ConnectionError";

interface Props {
  children: ReactNode;
}

const Container: FC<Props> = ({ children }) => {
  const location = useLocation();
  const readingMode = location.pathname.startsWith("/read/");
  const { dbConnectionStatus, serverConnectionStatus } = useAuth();

  if (!serverConnectionStatus) {
    return <ConnectionError type="server" />;
  }

  if (!dbConnectionStatus) {
    return <ConnectionError type="database" />;
  }

  if (readingMode) return children;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1500px] w-full mx-auto">{children}</div>
    </div>
  );
};

export default Container;
