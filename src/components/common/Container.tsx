import { FC, ReactNode } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import NoConnection from "./NoConnection";

interface Props {
  children: ReactNode;
}

const Container: FC<Props> = ({ children }) => {
  const location = useLocation();
  const readingMode = location.pathname.startsWith("/read/");
  const { dbConnectionStatus } = useAuth();

  if (!dbConnectionStatus) {
    return <NoConnection />;
  }

  if (readingMode) return children;
  return (
    <div>
      <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
};

export default Container;
