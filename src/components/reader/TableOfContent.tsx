import { Accordion, AccordionItem } from "@nextui-org/react";
import clsx from "clsx";
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
  currentLocation: string;
}

const TableOfContent: FC<Props> = ({
  visible,
  data = [],
  onClick,
  currentLocation,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>, href: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(href);
    }
  };

  if (!data) return null;

  return (
    <div
      role="navigation"
      aria-label="Table of Contents"
      style={{ right: visible ? "0" : "-100%" }}
      className="
        dark:bg-book-dark dark:text-book-dark
        transition-all duration-300 ease-in-out
        md:w-96 w-3/4 bg-white/95 backdrop-blur-sm
        h-screen overflow-y-auto fixed z-50 top-0 right-0
        flex flex-col p-4 shadow-xl
        border-l dark:border-gray-800
      "
    >
      <h2 className="text-2xl font-serif font-semibold mb-6 px-2 text-center border-b pb-2 dark:border-gray-700">
        Contents
      </h2>
      <div className="space-y-1">
        {data.map(({ label, subItems }, index) => {
          {
            // console.log("currentLocation", currentLocation);
          }
          {
            // if (String(label.href) === currentLocation)
            // console.log("Label Location", label.href);
          }
          if (!subItems.length)
            return (
              <div
                key={label.href}
                className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded"
              >
                <span className="text-gray-400 pt-2 pl-2 min-w-[2rem] font-serif">
                  {index + 1}.
                </span>
                <p
                  role="button"
                  tabIndex={0}
                  onClick={() => onClick(label.href)}
                  onKeyPress={(e) => handleKeyPress(e, label.href)}
                  className={clsx(
                    "py-2 pr-2 w-full cursor-pointer focus:outline-none font-medium ",
                    String(label.href).includes(currentLocation)
                      ? "text-blue-500"
                      : ""
                  )}
                  aria-label={`Navigate to ${label.title}`}
                >
                  {label.title}
                </p>
              </div>
            );

          return (
            <Accordion
              key={label.href}
              className="px-0 pb-0 pt-0 shadow-none"
              variant="light"
              itemClasses={{
                title: "font-medium",
                trigger:
                  "px-0 py-0 data-[hover=true]:bg-gray-50 dark:data-[hover=true]:bg-gray-800/50 rounded-lg",
                content: "pb-0",
              }}
            >
              <AccordionItem
                title={
                  <div className={clsx("flex items-start gap-3 w-full py-2")}>
                    <span className={clsx("text-gray-400 pl-2 font-serif")}>
                      {index + 1}.
                    </span>
                    <span
                      className={
                        String(label.href).includes(currentLocation)
                          ? "text-blue-500"
                          : ""
                      }
                    >
                      {label.title}
                    </span>
                  </div>
                }
                aria-label={`Section ${label.title}`}
                className="border-0"
              >
                <div className="ml-8 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                  {subItems.map((item, subIndex) => (
                    <div
                      key={item.href}
                      className="flex items-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded"
                    >
                      <span className="text-gray-400 pt-2 pl-2 min-w-[2rem] text-sm font-serif">
                        {index + 1}.{subIndex + 1}
                      </span>
                      <p
                        role="button"
                        tabIndex={0}
                        onClick={() => onClick(item.href)}
                        onKeyPress={(e) => handleKeyPress(e, item.href)}
                        className={clsx(
                          "py-2 pr-2 w-full cursor-pointer text-sm focus:outline-none focus:text-primary text-gray-600 dark:text-gray-300"
                        )}
                        aria-label={`Navigate to ${item.title}`}
                      >
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default TableOfContent;
