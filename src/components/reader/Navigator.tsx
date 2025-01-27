import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface Props {
  side: "left" | "right";
  className?: string;
  onClick(): void;
}

const Navigator: FC<Props> = ({ side, className, onClick }) => {
  const icon =
    side === "left" ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />;
  const position = side === "left" ? "left-2 md:left-4" : "right-2 md:right-4";

  return (
    <div
      className={clsx(
        "fixed top-1/2 -translate-y-1/2 z-30",
        position,
        className,
        "transition-opacity duration-300 ease-in-out"
      )}
    >
      <Button
        radius="full"
        variant="bordered"
        isIconOnly
        className={clsx(
          "w-12 h-12",
          "bg-background/60 backdrop-blur-md",
          "border-default-200 dark:border-default-100",
          "text-foreground",
          "hover:bg-default-100",
          "shadow-md hover:shadow-lg",
          "transition-all duration-300"
        )}
        onClick={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};

export default Navigator;
