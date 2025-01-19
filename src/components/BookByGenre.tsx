import { FC, useEffect, useState } from "react";
import client from "../api/client";
import LoadingSpinner from "./common/LoadingSpinner";
import { calculateDiscount, formatPrice, ParseError } from "../utils/helper";
import { Link } from "react-router-dom";
import { Chip} from "@nextui-org/react";
import { FaStar } from "react-icons/fa6";
import DividerWithTitle from "./common/DividerWithTitle";
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

  return (
    <div className="container mx-auto px-4">
      <DividerWithTitle title={genre} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/book/${book.slug}`}
            className="group hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-4 h-full flex flex-col border border-gray-100 dark:border-gray-700">
              <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Chip color="danger" radius="sm" size="sm">
                    {calculateDiscount(book.price)}% Off
                  </Chip>
                </div>
              </div>

              <div className="flex-grow space-y-3">
                <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-gray-800 dark:text-gray-100">
                  {book.title}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className="text-primary dark:text-danger font-bold">
                    {formatPrice(Number(book.price.sale))}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm line-through">
                    {formatPrice(Number(book.price.mrp))}
                  </span>
                </div>

                <div className="mt-auto">
                  {book.rating ? (
                    <Chip 
                      radius="sm" 
                      color="warning" 
                      variant="solid"
                      className="w-fit"
                    >
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{book.rating}</span>
                        <FaStar size={12} />
                      </div>
                    </Chip>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No Ratings
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookByGenre;
