import { Card, CardBody, Chip } from "@nextui-org/react";
import { FC } from "react";
import { FaBook, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { calculateDiscount, formatPrice } from "../utils/helper";

export interface Book {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

interface Props {
  data: Book[];
  title?: string;
}

const BookList: FC<Props> = ({ title, data }) => {
  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {data.map((book) => (
          <Card
            key={book.id}
            as={Link}
            to={`/book/${book.slug}`}
            isPressable
            className="group border-none bg-background/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
            shadow="sm"
          >
            <CardBody className="p-0 overflow-hidden">
              <div className="relative aspect-[2/3]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10" />

                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-default-100 flex items-center justify-center">
                    <FaBook className="w-12 h-12 text-default-300" />
                  </div>
                )}

                {/* Price overlay - Always visible on mobile, hidden on desktop until hover */}
                <div className="absolute top-2 right-2 z-20">
                  <Chip
                    className="border border-white/20 shadow-lg"
                    color="danger"
                    size="sm"
                    variant="shadow"
                  >
                    {calculateDiscount(book.price)}% Off
                  </Chip>
                </div>
              </div>

              {/* Content section with title, genre, and price */}
              <div className="p-3 space-y-2">
                <div className="min-h-[2.5rem]">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-default-500 text-xs mt-1">{book.genre}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-default-200/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-default-400 line-through">
                      {formatPrice(Number(book.price.mrp))}
                    </span>
                    <span className="font-bold text-sm text-danger">
                      {formatPrice(Number(book.price.sale))}
                    </span>
                  </div>
                  {book.rating && (
                    <Chip
                      size="sm"
                      color="warning"
                      variant="flat"
                      className="bg-warning-50"
                      startContent={
                        <FaStar className="text-warning-500" size={12} />
                      }
                    >
                      {book.rating}
                    </Chip>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookList;
