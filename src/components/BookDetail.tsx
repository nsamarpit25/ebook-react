import { Button, Chip } from "@nextui-org/react";
import { FC, useState } from "react";
import {
  FaEarthAfrica,
  FaMasksTheater,
  FaRegCalendarDays,
  FaRegFileLines,
  FaStar,
} from "react-icons/fa6";
import { TbShoppingCartPlus } from "react-icons/tb";
import { Link } from "react-router-dom";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import { calculateDiscount, formatPrice, ParseError } from "../utils/helper";
import RichEditor from "./rich-editor";

export interface Book {
  id: string;
  title: string;
  genre: string;
  language: string;
  slug: string;
  description: string;
  publicationName: string;
  fileInfo: {
    id: string;
    size: string;
  };
  publishedAt: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Props {
  book?: Book;
}

const BookDetail: FC<Props> = ({ book }) => {
  const { updateCart, pending } = useCart();
  const [busy, setBusy] = useState(false);
  const { profile } = useAuth();

  if (!book) return null;

  const handleCartUpdate = () => {
    updateCart({ product: book, quantity: 1 });
  };

  const {
    id,
    slug,
    cover,
    title,
    description,
    author,
    rating,
    publicationName,
    price,
    language,
    fileInfo,
    genre,
    publishedAt,
  } = book;

  const alreadyPurchased = profile?.books?.includes(id) || false;

  const handleBuyNow = async () => {
    try {
      setBusy(true);
      const { data } = await client.post("/checkout/instant", {
        productId: id,
      });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      ParseError(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="md:flex gap-12">
          <div className="flex-shrink-0">
            <img
              src={cover}
              alt={title}
              className="w-64 h-96 rounded-xl shadow-md object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 pt-6 md:pt-0">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {title}
            </h1>

            <div className="space-y-2 mb-6">
              <Link
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                to={`/author/${author.id}`}
              >
                {author.name}
              </Link>
              <p className="text-gray-600 dark:text-gray-400">
                {publicationName}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(Number(price.sale))}
              </p>
              <p className="text-lg line-through text-gray-400 dark:text-gray-500">
                {formatPrice(Number(price.mrp))}
              </p>
              <Chip color="danger" className="text-lg">
                {`${calculateDiscount(price)}% Off`}
              </Chip>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {rating ? (
                <Chip color="warning" className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{rating}</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                </Chip>
              ) : (
                <Chip className="bg-gray-100 dark:bg-gray-700">
                  <span className="text-sm dark:text-gray-300">No Ratings</span>
                </Chip>
              )}
              {alreadyPurchased ? (
                <Link
                  to={`/rate/${id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Add a Review
                </Link>
              ) : null}
            </div>

            <div className="mb-8 prose dark:prose-invert">
              <RichEditor value={description} className="max-w-none regular" />
            </div>

            <div className="grid grid-cols-4 gap-6 py-6 border-y border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center gap-2">
                <FaEarthAfrica className="text-2xl text-gray-700 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <FaMasksTheater className="text-2xl text-gray-700 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {genre}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <FaRegFileLines className="text-2xl text-gray-700 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {fileInfo.size}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <FaRegCalendarDays className="text-2xl text-gray-700 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {publishedAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              {alreadyPurchased ? (
                <Button
                  radius="full"
                  size="lg"
                  className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8"
                  as={Link}
                  to={`/read/${slug}?title=${title}`}
                >
                  Read Now
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCartUpdate}
                    radius="full"
                    size="lg"
                    variant="bordered"
                    startContent={<TbShoppingCartPlus className="text-xl" />}
                    isLoading={pending || busy}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    radius="full"
                    size="lg"
                    className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8"
                    isLoading={pending || busy}
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
