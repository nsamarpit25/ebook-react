import { Card, CardBody, CardFooter, Chip, Divider } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import client from "../api/client";
import { calculateDiscount, formatPrice, ParseError } from "../utils/helper";
import Skeletons from "./Skeletons";

interface Props {
  genre: string;
}

interface Book {
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

const BookByGenre: FC<Props> = ({ genre }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // console.log("reached here");
        const { data } = await client.get(`book/by-genre/${genre}`);
        setBooks(data.books);
      } catch (error) {
        ParseError(error);
      } finally {
        setBusy(false);
      }
    };
    fetchBooks();
  }, [genre]);

  if (busy) return <Skeletons.BookList />;
  if (books.length === 0) return null;

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
          {genre}
        </h2>
        <Divider className="flex-1 mx-4" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {books.map((book) => (
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
                {/* Gradient overlay - mobile always visible, desktop on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent sm:from-black/60
                    block sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10"
                />

                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Discount chip */}
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

                {/* Price and rating - mobile always visible, desktop on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-3 text-white
                    block sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 z-20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/70 line-through">
                        {formatPrice(Number(book.price.mrp))}
                      </span>
                      <span className="font-bold text-sm text-danger-400">
                        {formatPrice(Number(book.price.sale))}
                      </span>
                    </div>
                    {book.rating && (
                      <Chip
                        size="sm"
                        color="warning"
                        variant="shadow"
                        classNames={{
                          base: "border border-white/20",
                          content: "font-bold",
                        }}
                        startContent={<FaStar size={12} />}
                      >
                        {book.rating}
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter className="px-3 py-2 bg-content1/5 backdrop-blur-md">
              <div className="w-full">
                <h3 className="font-medium text-sm line-clamp-2">
                  {book.title}
                </h3>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookByGenre;
