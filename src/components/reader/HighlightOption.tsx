import { Button, Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { MdOutlineClear } from "react-icons/md";
// import { useAutoHide } from "./useAutoHide";

interface Props {
  visible?: boolean;
  onClear(): void;
  onSelect(color: string): void;
}

const colorOptions = [
  { color: "#ffd700", name: "Yellow" },
  { color: "#ff7f7f", name: "Red" },
  { color: "#90EE90", name: "Green" },
  { color: "#87CEEB", name: "Blue" },
];

const HighlightOptions: FC<Props> = ({ visible, onSelect, onClear }) => {
  return (
    <div
      className={clsx(
        visible ? "bottom-0" : "-bottom-20",
        "transition-all duration-300 h-16 fixed z-50 left-0 right-0",
        "bg-background/80 backdrop-blur-md",
        "border-t border-default-200",
        "shadow-large"
      )}
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-center gap-4">
        {colorOptions.map(({ color, name }) => (
          <Tooltip key={color} content={name} placement="top">
            <button
              onClick={() => onSelect(color)}
              className={clsx(
                "w-8 h-8 rounded-full",
                "transition-all duration-300",
                "hover:scale-110 focus:scale-110",
                "focus:outline-none",
                "ring-2 ring-offset-2",
                "shadow-sm hover:shadow-md",
                "transform active:scale-95"
              )}
              style={{
                backgroundColor: color,
                // ringColor: color,
              }}
            />
          </Tooltip>
        ))}
        <Tooltip content="Clear highlight" placement="top">
          <Button
            onClick={onClear}
            isIconOnly
            variant="light"
            className="text-default-600 hover:text-danger"
          >
            <MdOutlineClear size={24} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default HighlightOptions;
