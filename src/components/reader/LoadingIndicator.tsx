import { Spinner } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";

interface Props {
  visible?: boolean;
}

const LoadingIndicator: FC<Props> = ({ visible }) => {
  return (
    <div
      className={clsx(
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        "fixed z-[100] inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
        "transition-all duration-300",
        "flex flex-col items-center justify-center gap-6"
      )}
    >
      <div className="relative">
        <Spinner
          size="lg"
          classNames={{
            circle1: "border-t-primary border-4",
            circle2: "border-t-primary border-4",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary animate-bounce"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium dark:text-gray-200">
          Loading your book
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Please wait while we prepare your reading experience
        </p>
      </div>

      <div className="absolute bottom-8 text-center max-w-xs mx-auto text-sm text-gray-400 dark:text-gray-500">
        <p className="animate-pulse">
          Tip: You can customize text size and theme while reading
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
