import { Button, Card } from "@nextui-org/react";
import { FC, useEffect, useRef, useState } from "react";
import {
  FaArrowRightLong,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import type { BookDetail } from "../views/Library";
import LoadingSpinner from "./common/LoadingSpinner";

// const books = [
//   {
//     title: "The Girl with the Dragon Tattoo",
//     slogan: "A gripping thriller of mystery and suspense.",
//     subtitle: "A Thriller by Stieg Larsson",
//     cover:
//       "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943170/wiayfy2opfmbm5zztdut.png",
//     slug: "the-girl-with-the-dragon-tattoo-66d08b40ab9726b8a14859d9",
//   },
//   {
//     title: "The Road",
//     slogan: "A father and son journey through a desolate world.",
//     subtitle: "A Novel by Cormac McCarthy",
//     cover:
//       "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943172/bycfvhs8st7eosdimqwy.png",
//     slug: "the-road-66d08b40ab9726b8a14859d8",
//   },
//   {
//     title: "The Great Gatsby",
//     slogan: "A tale of love and ambition in the Jazz Age.",
//     subtitle: "A Classic by F. Scott Fitzgerald",
//     cover:
//       "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943178/nh5py32h7elbcawjpux5.png",
//     slug: "the-great-gatsby-66d08b40ab9726b8a14859d4",
//   },
//   {
//     title: "Pride and Prejudice",
//     slogan: "A timeless story of love and societal expectations.",
//     subtitle: "A Classic by Jane Austen",
//     cover:
//       "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943181/dszmpqruxweg5kpgxd3o.png",
//     slug: "the-girl-with-the-dragon-tattoo-66d08b40ab9726b8a14859d9",
//   },
// ];

const settings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  fade: true,
  cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
  arrows: false, // Changed to false to avoid any conflicts
  customPaging: () => (
    <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-danger/60 transition-colors duration-300" />
  ),
  dotsClass: "slick-dots !bottom-8 !hidden md:!flex md:justify-center w-full",
  prevArrow: <></>, // We'll use custom arrows
  nextArrow: <></>, // We'll use custom arrows
};

const HeroSection: FC = () => {
  const [books, setBooks] = useState<BookDetail[]>([]);
  const sliderRef = useRef<Slider | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRandomBooks = async () => {
      try {
        setLoading(true);
        const { data } = await client.get("/book/random/4");
        setBooks(data.books);
      } catch (error) {
        ParseError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomBooks();
  }, []);

  const goToPrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const trimmedContent = (html: string, maxLength: number) => {
    const textContent = html?.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    if (textContent.length <= maxLength) return textContent;
    if (textContent.length > maxLength)
      return textContent.slice(0, maxLength) + "...";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative overflow-hidden group">
      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50
          bg-background/80 hover:bg-background shadow-lg
          p-2 md:p-3 rounded-full
          transition-all duration-300 ease-in-out
          opacity-0 group-hover:opacity-100
          hover:scale-110 active:scale-95
          border border-divider"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-foreground" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50
          bg-background/80 hover:bg-background shadow-lg
          p-2 md:p-3 rounded-full
          transition-all duration-300 ease-in-out
          opacity-0 group-hover:opacity-100
          hover:scale-110 active:scale-95
          border border-divider"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-4 h-4 md:w-6 md:h-6 text-foreground" />
      </button>

      <Slider ref={sliderRef} {...settings}>
        {books.map((item) => (
          <div key={item.slug} className="relative">
            <div className="min-h-[550px] md:min-h-[650px] flex items-center">
              <Card className="w-full bg-background/60 backdrop-blur-sm border-none shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-12 lg:p-16">
                  {" "}
                  {/* Increased padding */}
                  {/* Content div with order adjustment */}
                  <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left order-2 md:order-1 py-6">
                    {" "}
                    {/* Increased py-6 */}
                    <div className="space-y-6 max-w-2xl">
                      {" "}
                      {/* Added max-width */}
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent leading-tight md:leading-tight lg:leading-tight pb-1">
                        {" "}
                        {/* Added leading-tight and pb-1 */}
                        {item.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-foreground/80">
                        {trimmedContent(item.description || "", 100)}
                      </p>
                      <p className="text-lg text-foreground/60 italic">
                        {/* {item.subtitle} */}
                      </p>
                    </div>
                    <Button
                      as={Link}
                      to={`/book/${item.slug}`}
                      size="lg"
                      color="danger"
                      variant="shadow"
                      endContent={<FaArrowRightLong />}
                      className="font-semibold"
                    >
                      Explore Now
                    </Button>
                  </div>
                  {/* Image container with order adjustment */}
                  <div className="relative w-48 sm:w-56 md:w-72 lg:w-80 order-1 md:order-2">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-danger/10 rounded-xl opacity-75 blur transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-2" />
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="relative w-full h-auto rounded-xl shadow-2xl
                        transform rotate-3 transition-all duration-500
                        hover:rotate-2 hover:scale-105 hover:shadow-danger/30 "
                      style={{
                        maxHeight: "460px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Add decorative elements */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tr from-primary/10 to-danger/10 rounded-full blur-xl" />
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-danger/10 to-primary/10 rounded-full blur-lg" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
