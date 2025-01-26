import { FC } from "react";
import { RiSignalWifiErrorLine, RiDatabaseLine } from "react-icons/ri";

interface Props {
  type: "server" | "database";
}

const ConnectionError: FC<Props> = ({ type }) => {
  const isServer = type === "server";
  const Icon = isServer ? RiSignalWifiErrorLine : RiDatabaseLine;
  const title = isServer
    ? "Server Connection Failed"
    : "Database Connection Failed";
  const message = isServer
    ? "Unable to connect to the server. Please check your internet connection and try again."
    : "Unable to connect to the database. We're working on fixing this issue.";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-danger rounded-full opacity-25 blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-full h-full">
            <Icon className="w-16 h-16 text-danger" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-danger text-white font-medium shadow-lg hover:shadow-danger/25 transition-shadow"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default ConnectionError;
