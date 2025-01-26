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
    <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book Cover */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-48 md:w-64">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
            <img
              src={cover}
              alt={title}
              className="w-full aspect-[2/3] rounded-xl shadow-lg object-cover relative
                transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold">{title}</h1>

          <div className="space-y-2">
            <Link
              className="text-xl font-semibold text-primary hover:text-danger transition-colors"
              to={`/author/${author.id}`}
            >
              {author.name}
            </Link>
            <p className="text-foreground-500">{publicationName}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
              {formatPrice(Number(price.sale))}
            </p>
            <p className="text-lg line-through text-foreground-500">
              {formatPrice(Number(price.mrp))}
            </p>
            <Chip
              color="danger"
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-r from-primary to-danger text-white",
              }}
            >
              {`${calculateDiscount(price)}% Off`}
            </Chip>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-4">
            {rating ? (
              <Chip
                color="warning"
                variant="shadow"
                className="px-4 py-2"
                startContent={<FaStar className="text-yellow-400" />}
              >
                <span className="text-lg font-semibold">{rating}</span>
              </Chip>
            ) : (
              <Chip variant="flat">No Ratings</Chip>
            )}
            {alreadyPurchased && (
              <Link
                to={`/rate/${id}`}
                className="text-primary hover:text-danger transition-colors"
              >
                Add a Review
              </Link>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <RichEditor value={description} className="regular" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-divider">
            <InfoItem icon={FaEarthAfrica} text={language} />
            <InfoItem icon={FaMasksTheater} text={genre} />
            <InfoItem icon={FaRegFileLines} text={fileInfo.size} />
            <InfoItem icon={FaRegCalendarDays} text={publishedAt} />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {alreadyPurchased ? (
              <Button
                as={Link}
                to={`/read/${slug}?title=${title}&id=${id}`}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-danger text-white shadow-lg
                  hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
                radius="full"
                size="lg"
              >
                Read Now
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCartUpdate}
                  isLoading={pending || busy}
                  startContent={<TbShoppingCartPlus className="text-xl" />}
                  radius="full"
                  size="lg"
                  variant="bordered"
                  className="w-full sm:w-auto hover:bg-content2 transition-colors"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  isLoading={pending || busy}
                  radius="full"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-danger text-white shadow-lg
                    hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
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

// Update InfoItem component
const InfoItem: FC<{ icon: any; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center gap-2 text-center group">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
      <Icon className="text-2xl text-primary relative" />
    </div>
    <span className="text-sm text-foreground-500">{text}</span>
  </div>
);

export default BookDetail;
