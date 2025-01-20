import { Card, Skeleton } from "@nextui-org/react";
import { FC } from "react";

const Payment: FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <Card className="max-w-4xl w-full mx-auto overflow-visible">
        <div className="relative">
          {/* Success Badge Skeleton */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          {/* Header Skeleton */}
          <div className="text-center pt-16 pb-8 px-6">
            <Skeleton className="h-8 w-64 mx-auto mb-4 rounded-lg" />
            <Skeleton className="h-4 w-80 mx-auto rounded-lg" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              {/* Items List Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 rounded-lg mb-6" />
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <Skeleton className="w-20 h-28 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4 rounded-lg" />
                      <div className="space-y-1 pt-2">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-4 w-20 rounded-lg" />
                        <Skeleton className="h-4 w-32 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Skeleton */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
                <Skeleton className="h-6 w-40 rounded-lg" />
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex justify-between py-2">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                  ))}
                  <div className="flex justify-between py-2">
                    <Skeleton className="h-5 w-32 rounded-lg" />
                    <Skeleton className="h-5 w-32 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Payment;
