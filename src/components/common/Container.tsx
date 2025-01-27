import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "./Navbar";
import ConnectionError from "./ConnectionError";
import Footer from "../Footer";

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
      <div className="w-full bg-content2/30 backdrop-blur-sm border-b border-content3">
        <div className="max-w-[1500px] mx-auto px-4 py-2 text-xs text-foreground-500 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>
            Demo Project: Books are for demonstration only. Please don't upload
            copyrighted material.
            <a
              href="https://github.com/yourusername/projectname"
              className="ml-1 text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report issues on GitHub
            </a>
          </p>
        </div>
      </div>
      <div className="max-w-[1500px] w-full mx-auto">{children}</div>
      <Footer />
    </div>
  );
};

export default Container;
