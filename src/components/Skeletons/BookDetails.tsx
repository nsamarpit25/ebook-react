import { FC } from "react";

const BookDetails: FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Book Cover Skeleton */}
        <div className="w-full md:w-64 h-72 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />

          {/* Author & Publication Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 animate-pulse" />
          </div>

          {/* Price Section Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 animate-pulse" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-4 pt-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-36 animate-pulse" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-36 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
