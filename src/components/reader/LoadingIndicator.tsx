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
        "fixed z-[100] inset-0 bg-background/95 backdrop-blur-xl",
        "transition-all duration-300",
        "flex flex-col items-center justify-center gap-6"
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-danger rounded-full opacity-25 blur-lg animate-pulse" />
        <Spinner
          size="lg"
          classNames={{
            wrapper: "w-16 h-16",
            circle1: "border-t-primary border-4",
            circle2: "border-t-danger border-4",
          }}
        />
      </div>

      <div className="text-center space-y-2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-xl opacity-25 blur-lg animate-pulse" />
        <h3 className="text-xl font-medium text-default-600 relative">
          Loading your book
        </h3>
        <p className="text-sm text-default-400 animate-pulse relative">
          Please wait while we prepare your reading experience
        </p>
      </div>

      <div className="absolute bottom-8 text-center max-w-xs mx-auto">
        <p className="text-sm text-default-400 animate-pulse">
          Tip: You can customize text size and theme while reading
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
