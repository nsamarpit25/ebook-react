import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { MdOutlineClear } from "react-icons/md";
import { Tooltip } from "@nextui-org/react";
import { useAutoHide } from "../../hooks/useAutoHide";
// import { useAutoHide } from "./useAutoHide";

interface Props {
  visible?: boolean;
  onClear(): void;
  onSelect(color: string): void;
}

const colorOptions = [
  { color: "#ffd700", name: "Yellow" },
  { color: "#ff7f7f", name: "Red" },
  { color: "#87ceeb", name: "Blue" },
];

const HighlightOptions: FC<Props> = ({ visible, onSelect, onClear }) => {
  const { isVisible } = useAutoHide(visible);

  return (
    <div
      className={clsx(
        isVisible ? "bottom-0" : "-bottom-20",
        "transition-all duration-300 h-16 fixed z-50 left-0 right-0",
        "backdrop-blur-md bg-white/90 dark:bg-gray-900/90",
        "border-t dark:border-gray-800 shadow-lg"
      )}
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-center gap-4">
        {colorOptions.map(({ color, name }) => (
          <Tooltip key={color} content={name}>
            <button
              onClick={() => onSelect(color)}
              className={clsx(
                "w-8 h-8 rounded-full transition-transform",
                "hover:scale-110 focus:scale-110 focus:outline-none",
                "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900",
                "shadow-sm"
              )}
              style={{
                backgroundColor: color,
                // ringColor: color,
              }}
            />
          </Tooltip>
        ))}
        <Tooltip content="Clear highlight">
          <Button
            onClick={onClear}
            isIconOnly
            variant="light"
            className="text-gray-700 dark:text-gray-300"
          >
            <MdOutlineClear size={24} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default HighlightOptions;
