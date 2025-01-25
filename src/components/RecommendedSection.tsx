import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import client from "../api/client";
import { formatPrice, ParseError } from "../utils/helper";
import { Book } from "./BookList";
import Skeletons from "./Skeletons";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

interface Props {
  id?: string;
}

const RecommendedSection: FC<Props> = ({ id }) => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const { dbConnectionStatus } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      try {
        if (!dbConnectionStatus) {
          toast.error("Connection to database failed. Please try again later.");
        }
        const { data } = await client.get("/book/recommended/" + id);
        setBooks(data);
      } catch (error) {
        ParseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchBooks();
  }, [id, dbConnectionStatus]);

  if (!id) return null;
  if (fetching) return <Skeletons.BookList />;
  if (!books.length) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
        Related Books
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/book/${book.slug}`}
            className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>

              <div className="flex-1 space-y-1 sm:space-y-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {book.title}
                </h3>

                <div className="flex items-center justify-between text-sm sm:text-base">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(Number(book.price.sale))}
                  </p>
                  {book.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span>{book.rating}</span>
                      <FaStar className="text-xs sm:text-sm" />
                    </div>
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

export default RecommendedSection;
