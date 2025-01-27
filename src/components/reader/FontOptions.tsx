import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { FC } from "react";
import { IoMdText } from "react-icons/io";
import { HiMiniMinus, HiMiniPlus } from "react-icons/hi2";
import { useAutoHide } from "../../hooks/useAutoHide";

interface Props {
  onFontDecrease?(): void;
  onFontIncrease?(): void;
}

const FontOptions: FC<Props> = ({ onFontDecrease, onFontIncrease }) => {
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
          <IoMdText size={24} className="text-default-600" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-2 bg-background/95 backdrop-blur-xl border border-default-200/50">
        <div className="flex items-center gap-4 px-2">
          <Tooltip content="Decrease font size" placement="bottom">
            <Button
              isIconOnly
              variant="light"
              className="relative group transition-all duration-300"
              onClick={onFontDecrease}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <HiMiniMinus size={18} className="text-default-600" />
            </Button>
          </Tooltip>
          <Tooltip content="Increase font size" placement="bottom">
            <Button
              isIconOnly
              variant="light"
              className="relative group transition-all duration-300"
              onClick={onFontIncrease}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <HiMiniPlus size={18} className="text-default-600" />
            </Button>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontOptions;
