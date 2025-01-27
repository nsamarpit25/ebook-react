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
import { HiSun, HiMoon } from "react-icons/hi2";

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
          className="relative group transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
          <HiSun size={24} className="text-default-600 dark:hidden" />
          <HiMoon size={24} className="text-default-600 hidden dark:block" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-2 bg-background/95 backdrop-blur-xl border border-default-200/50">
        <div className="flex items-center gap-3">
          <Tooltip content="Light theme" placement="bottom">
            <Button
              variant="light"
              className="relative group transition-all duration-300"
              onClick={() => onThemeSelect?.("light")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <span className="flex items-center gap-2">
                <HiSun size={20} />
                Light
              </span>
            </Button>
          </Tooltip>
          <Tooltip content="Dark theme" placement="bottom">
            <Button
              variant="light"
              className="relative group transition-all duration-300"
              onClick={() => onThemeSelect?.("dark")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <span className="flex items-center gap-2">
                <HiMoon size={20} />
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
