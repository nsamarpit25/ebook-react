import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useAutoHide } from "../../hooks/useAutoHide";

interface Props {
  side: "left" | "right";
  className?: string;
  onClick(): void;
}

const Navigator: FC<Props> = ({ side, className, onClick }) => {
  const icon =
    side === "left" ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />;
  const position = side === "left" ? "left-2 md:left-4" : "right-2 md:right-4";
  const { isVisible, show } = useAutoHide(true);

  return (
    <div
      className={clsx(
        "fixed top-1/2 -translate-y-1/2 z-30",
        position,
        className,
        !isVisible && "opacity-0"
      )}
      onMouseEnter={show}
    >
      <Button
        radius="full"
        variant="bordered"
        isIconOnly
        className={clsx(
          "w-12 h-12 backdrop-blur-sm",
          "bg-white/80 dark:bg-gray-900/80",
          "border-gray-200 dark:border-gray-800",
          "text-gray-700 dark:text-gray-300",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
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
