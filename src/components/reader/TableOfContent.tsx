import { Accordion, AccordionItem } from "@nextui-org/react";
import { FC, KeyboardEvent } from "react";

type BookNavItem = { title: string; href: string };
export type BookNavList = {
  label: BookNavItem;
  subItems: BookNavItem[];
};

interface Props {
  data: BookNavList[];
  visible?: boolean;
  onClick(href: string): void;
}

const TableOfContent: FC<Props> = ({ visible, data = [], onClick }) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>, href: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(href);
    }
  };

  if (!data.length) return null;

  return (
    <div
      role="navigation"
      aria-label="Table of Contents"
      style={{ right: visible ? "0" : "-100%" }}
      className="dark:bg-book-dark dark:text-book-dark transition-all md:w-96 w-3/4 bg-white h-screen overflow-y-scroll fixed z-50 top-0 right-0 flex flex-col space-y-3 p-3 shadow-md"
    >
      {data.map(({ label, subItems }) => {
        if (!subItems.length)
          return (
            <div key={label.href}>
              <p
                role="button"
                tabIndex={0}
                onClick={() => onClick(label.href)}
                onKeyPress={(e) => handleKeyPress(e, label.href)}
                className="py-2 text-large hover:underline cursor-pointer"
                aria-label={`Navigate to ${label.title}`}
              >
                {label.title}
              </p>
            </div>
          );

        return (
          <Accordion key={label.href} title={label.title}>
            <AccordionItem
              title={label.title}
              aria-label={`Section ${label.title}`}
            >
              <div className="space-y-3">
                {subItems.map((item) => (
                  <p
                    key={item.href}
                    role="button"
                    tabIndex={0}
                    onClick={() => onClick(item.href)}
                    onKeyPress={(e) => handleKeyPress(e, item.href)}
                    className="pl-6 text-large hover:underline cursor-pointer"
                    aria-label={`Navigate to ${item.title}`}
                  >
                    {item.title}
                  </p>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default TableOfContent;
