import { Skeleton } from "@nextui-org/react";
import { FC } from "react";

interface Props {
  items?: number;
}

const Orders: FC<Props> = ({ items = 3 }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Page Title Skeleton */}
      <Skeleton className="h-8 w-48 mb-8 rounded-lg bg-gray-200 dark:bg-gray-700" />

      {/* Orders List */}
      {Array(items).fill("").map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Order Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <Skeleton className="h-5 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Order Items */}
          {[1, 2].map((item) => (
            <div
              key={item}
              className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex p-6 items-start">
                <Skeleton className="w-20 h-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="ml-6 flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-6 w-24 rounded-lg ml-auto bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Order Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 rounded-b-lg flex justify-between items-center">
            <Skeleton className="h-5 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-6 w-36 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
