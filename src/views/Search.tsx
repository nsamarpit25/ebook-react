import { Button, Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { FaBook, FaStar } from "react-icons/fa";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/client";
import { calculateDiscount, formatPrice, ParseError } from "../utils/helper";

interface Props {}

interface Book {
  cover: string;
  genre: string;
  id: string;
  price: {
    mrp: string;
    sale: string;
  };
  slug: string;
  title: string;
}

const Search: FC<Props> = () => {
  const [params] = useSearchParams();
  const title = params.get("title");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.get(`/search/books?title=${title}`);
        setResults(data.results);
      } catch (error) {
        ParseError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [title]);

  console.log(results);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Spinner size="lg" color="danger" className="opacity-25" />
          <Spinner
            size="lg"
            color="danger"
            className="absolute inset-0 opacity-75"
          />
        </div>
        <p className="text-default-500 animate-pulse">
          Searching for "{title}"...
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <HiOutlineEmojiSad size={80} className="text-danger opacity-25" />
          <HiOutlineEmojiSad
            size={80}
            className="absolute inset-0 text-danger opacity-75 animate-pulse"
          />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-danger to-primary bg-clip-text text-transparent">
            No Results Found
          </h2>
          <p className="text-default-500 mb-6 max-w-md">
            We couldn't find any books matching "{title}". Try a different
            search term or browse our categories.
          </p>
          <Button
            as={Link}
            to="/"
            color="danger"
            variant="shadow"
            size="lg"
            className="bg-gradient-to-r from-danger to-primary"
          >
            Browse All Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-danger to-primary bg-clip-text text-transparent">
          Search Results
        </h1>
        <p className="text-default-500">
          Found {results.length} books matching "{title}"
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {results.map((book) => (
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
                  <p className="text-default-500 text-xs mt-1">{`${book.genre
                    .charAt(0)
                    .toUpperCase()}${book.genre.slice(1)}`}</p>
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
                  <Chip
                    size="sm"
                    color="warning"
                    variant="flat"
                    className="bg-warning-50"
                    startContent={
                      <FaStar className="text-warning-500" size={12} />
                    }
                  >
                    4.5
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Search;
