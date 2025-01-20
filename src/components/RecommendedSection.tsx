import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import client from "../api/client";
import { formatPrice, ParseError } from "../utils/helper";
import { Book } from "./BookList";
import Skeletons from "./Skeletons";

interface Props {
  id?: string;
}

const RecommendedSection: FC<Props> = ({ id }) => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      try {
        const { data } = await client.get("/book/recommended/" + id);
        setBooks(data);
      } catch (error) {
        ParseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchBooks();
  }, [id]);

  if (!id) return null;
  if (fetching) return <Skeletons.BookList />;
  if (!books.length) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Related Books
      </h2>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {books.map((book) => (
          <Link 
            key={book.id} 
            to={`/book/${book.slug}`}
            className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex flex-col space-y-3">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {book.title}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(Number(book.price.sale))}
                  </p>
                  {book.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span>{book.rating}</span>
                      <FaStar />
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
