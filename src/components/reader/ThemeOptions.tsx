import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { FC } from "react";
import { HiColorSwatch } from "react-icons/hi";
import { useAutoHide } from "../../hooks/useAutoHide";

export type ThemeModes = "light" | "dark";

interface Props {
  onThemeSelect?(mode: ThemeModes): void;
}

const ThemeOptions: FC<Props> = ({ onThemeSelect }) => {
  const { isVisible, show, hide } = useAutoHide(false);

  return (
    <Popover
      showArrow
      placement="bottom"
      offset={20}
      isOpen={isVisible}
      onOpenChange={(open) => (open ? show() : hide())}
    >
      <PopoverTrigger>
        <Button
          variant="light"
          isIconOnly
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HiColorSwatch size={24} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-2 bg-white dark:bg-gray-900 border dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Tooltip content="Light theme">
            <Button
              variant="light"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onThemeSelect?.("light")}
            >
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border border-gray-200" />
                Light
              </span>
            </Button>
          </Tooltip>
          <Tooltip content="Dark theme">
            <Button
              variant="light"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onThemeSelect?.("dark")}
            >
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-900 border border-gray-700" />
                Dark
              </span>
            </Button>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeOptions;
