import { FC } from "react";
import { calculateDiscount, formatPrice } from "../utils/helper";
import { Chip } from "@nextui-org/react";
import DividerWithTitle from "./common/DividerWithTitle";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <DividerWithTitle title={title} />

      <div className="mt-8 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {data.map((book) => {
          return (
            <Link 
              key={book.id} 
              to={`/book/${book.slug}`}
              className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-3">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-36 h-52 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all"
                />

                <div className="w-full space-y-2">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {book.title}
                  </p>

                  <div className="flex items-center justify-between">
                    <Chip color="danger" radius="sm" size="sm">
                      {calculateDiscount(book.price)}% Off
                    </Chip>
                    {book.rating && (
                      <Chip radius="sm" color="warning" variant="flat" size="sm">
                        <div className="flex items-center gap-1">
                          <span>{book.rating}</span>
                          <FaStar className="text-yellow-500" />
                        </div>
                      </Chip>
                    )}
                  </div>
                </div>

                <div className="w-full flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(Number(book.price.sale))}
                  </p>
                  <p className="text-sm line-through text-gray-400">
                    {formatPrice(Number(book.price.mrp))}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;
