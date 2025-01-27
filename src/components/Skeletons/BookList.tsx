import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import { FC } from "react";

export interface Props {
  itemsCount?: number;
}

const BookList: FC<Props> = ({ itemsCount = 5 }) => {
  const fakeData = new Array(itemsCount).fill("");

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <Skeleton
          isLoaded={false}
          disableAnimation
          className="h-8 w-48 rounded-lg"
        />
        <Skeleton
          isLoaded={false}
          disableAnimation
          className="h-[1px] flex-1 mx-4"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {fakeData.map((_, index) => (
          <Card
            key={index}
            className="border-none bg-background/60 backdrop-blur-sm"
          >
            <CardBody className="p-0 overflow-hidden">
              <div className="relative aspect-[2/3]">
                <Skeleton
                  isLoaded={false}
                  disableAnimation
                  className="absolute inset-0 rounded-lg"
                />
                {/* Discount chip skeleton */}
                <div className="absolute top-2 right-2 z-20">
                  <Skeleton
                    isLoaded={false}
                    disableAnimation
                    className="h-5 w-16 rounded-full"
                  />
                </div>
                {/* Price and rating skeleton */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <Skeleton
                        isLoaded={false}
                        disableAnimation
                        className="h-3 w-14 rounded"
                      />
                      <Skeleton
                        isLoaded={false}
                        disableAnimation
                        className="h-4 w-16 rounded"
                      />
                    </div>
                    <Skeleton
                      isLoaded={false}
                      disableAnimation
                      className="h-6 w-14 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter className="px-3 py-2">
              <Skeleton
                isLoaded={false}
                disableAnimation
                className="w-full h-4 rounded"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookList;
