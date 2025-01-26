import { Button, Chip } from "@nextui-org/react";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import {
  FaEarthAfrica,
  FaMasksTheater,
  FaRegCalendarDays,
  FaRegFileLines,
  FaStar,
} from "react-icons/fa6";
import { TbShoppingCartPlus } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
      if (!profile) {
        handleCartUpdate();
        toast.success(
          "Book added to cart. Please sign up to complete the purchase",
          { position: "top-right", duration: 5000 }
        );
        return navigate("/sign-up");
      }
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
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Book Cover */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-48 sm:w-56 md:w-64">
          <img
            src={cover}
            alt={title}
            className="w-full aspect-[2/3] rounded-lg sm:rounded-xl shadow-md object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h1>

          <div className="space-y-2">
            <Link
              className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              to={`/author/${author.id}`}
            >
              {author.name}
            </Link>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {publicationName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(Number(price.sale))}
            </p>
            <p className="text-base sm:text-lg line-through text-gray-400 dark:text-gray-500">
              {formatPrice(Number(price.mrp))}
            </p>
            <Chip color="danger" className="text-sm sm:text-base">
              {`${calculateDiscount(price)}% Off`}
            </Chip>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {rating ? (
              <Chip color="warning" className="px-3 sm:px-4 py-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">{rating}</span>
                  <FaStar className="text-yellow-400" />
                </div>
              </Chip>
            ) : (
              <Chip className="bg-gray-100 dark:bg-gray-700">
                <span className="text-sm dark:text-gray-300">No Ratings</span>
              </Chip>
            )}
            {alreadyPurchased && (
              <Link
                to={`/rate/${id}`}
                className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Add a Review
              </Link>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
            <RichEditor value={description} className="regular" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200 dark:border-gray-700">
            <InfoItem icon={FaEarthAfrica} text={language} />
            <InfoItem icon={FaMasksTheater} text={genre} />
            <InfoItem icon={FaRegFileLines} text={fileInfo.size} />
            <InfoItem icon={FaRegCalendarDays} text={publishedAt} />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            {alreadyPurchased ? (
              <Button
                radius="full"
                size="lg"
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white w-full sm:w-auto px-8"
                as={Link}
                to={`/read/${slug}?title=${title}&id=${id}`}
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
                  className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  radius="full"
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8"
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
  );
};

// Add this helper component for the info items
const InfoItem: FC<{ icon: any; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center gap-2 text-center">
    <Icon className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300" />
    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      {text}
    </span>
  </div>
);

export default BookDetail;
