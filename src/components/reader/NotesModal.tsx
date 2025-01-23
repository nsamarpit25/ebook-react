import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Card,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { Book } from "epubjs";
import { FC, useEffect, useState } from "react";
import { useAutoHide } from "../../hooks/useAutoHide";

interface Props {
  book?: Book;
  notes?: string[];
  isOpen?: boolean;
  onClose?(): void;
  onNoteClick?(path: string): void;
}

const NotesModal: FC<Props> = ({
  book,
  notes,
  isOpen,
  onClose,
  onNoteClick,
}) => {
  const [data, setData] = useState<{ note: string; cfi: string }[]>([]);
  const { isVisible, show, hide } = useAutoHide(false, 8000000);

  useEffect(() => {
    if (!notes || !book) return;

    const newNotes = Promise.all(
      notes.map(async (cfi) => {
        const note = (await book.getRange(cfi)).toString();
        return { note, cfi };
      })
    );

    newNotes.then(setData);
  }, [notes, book]);

  useEffect(() => {
    if (isOpen) show();
  }, [isOpen]);

  const handleClose = () => {
    hide();
    onClose?.();
  };

  return (
    <Modal
      size="2xl"
      isOpen={isVisible}
      onClose={handleClose}
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b dark:border-gray-800",
        body: "py-6",
        closeButton:
          "hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Notes & Highlights</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.length} items
          </p>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="space-y-4">
            {data.map((item, index) => (
              <Card
                key={item.cfi}
                isPressable
                onPress={() => {
                  onNoteClick?.(item.cfi);
                  handleClose();
                }}
                className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <CardBody>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                        {item.note}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NotesModal;
