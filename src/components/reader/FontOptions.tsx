import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { FC } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { RiFontSize } from "react-icons/ri";
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
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <RiFontSize size={24} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-2 bg-white dark:bg-gray-900 border dark:border-gray-800">
        <div className="flex items-center gap-4 px-2">
          <Tooltip content="Decrease font size">
            <Button
              isIconOnly
              variant="light"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onFontDecrease}
            >
              <FaMinus size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Increase font size">
            <Button
              isIconOnly
              variant="light"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onFontIncrease}
            >
              <FaPlus size={16} />
            </Button>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontOptions;
