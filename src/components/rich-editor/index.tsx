import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import clsx from "clsx";
import { FC, ReactNode, useEffect, useState } from "react";
import Tools from "./Tools";

interface Props {
  className?: string;
  value?: string;
  onChange?(html: string): void;
  editable?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  placeholder?: string;
}

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ul",
      },
    },
    orderedList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ol",
      },
    },
  }),
];

const RichEditor: FC<Props> = ({
  placeholder,
  isInvalid,
  errorMessage,
  value,
  editable,
  className,
  onChange,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    editable: editable !== false,
    onUpdate({ editor }) {
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || isInitialized) return;
    
    if (value) {
      editor.commands.setContent(value);
    }
    
    setIsInitialized(true);
  }, [editor, value, isInitialized]);

  useEffect(() => {
    if (!editor || !isInitialized) return;
    
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor, isInitialized]);

  return (
    <div
      className={clsx(
        isInvalid && "ring-2 ring-red-400 p-2 rounded-medium",
        "rich-editor-container"
      )}
    >
      <Tools editor={editor} visible={editable} />
      <EditorContent 
        editor={editor} 
        content={value} 
        className={clsx(
          className,
          editable ? "min-h-[6.5em]" : "h-auto",
          "prose max-w-none"
        )} 
      />
      {errorMessage}
    </div>
  );
};

export default RichEditor;
