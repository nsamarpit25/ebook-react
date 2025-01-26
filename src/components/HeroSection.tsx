import { Button } from "@nextui-org/react";
import React, { FC } from "react";
import {
  FaArrowRightLong,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";

interface Props {}

const books = [
  {
    title: "The Girl with the Dragon Tattoo",
    slogan: "A gripping thriller of mystery and suspense.",
    subtitle: "A Thriller by Stieg Larsson",
    cover:
      "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943170/wiayfy2opfmbm5zztdut.png",
    slug: "the-girl-with-the-dragon-tattoo-66d08b40ab9726b8a14859d9",
  },
  {
    title: "The Road",
    slogan: "A father and son journey through a desolate world.",
    subtitle: "A Novel by Cormac McCarthy",
    cover:
      "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943172/bycfvhs8st7eosdimqwy.png",
    slug: "the-road-66d08b40ab9726b8a14859d8",
  },
  {
    title: "The Great Gatsby",
    slogan: "A tale of love and ambition in the Jazz Age.",
    subtitle: "A Classic by F. Scott Fitzgerald",
    cover:
      "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943178/nh5py32h7elbcawjpux5.png",
    slug: "the-great-gatsby-66d08b40ab9726b8a14859d4",
  },
  {
    title: "Pride and Prejudice",
    slogan: "A timeless story of love and societal expectations.",
    subtitle: "A Classic by Jane Austen",
    cover:
      "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943181/dszmpqruxweg5kpgxd3o.png",
    slug: "the-girl-with-the-dragon-tattoo-66d08b40ab9726b8a14859d9",
  },
];

const CustomArrow = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`absolute z-10 top-1/2 -translate-y-1/2 ${
      direction === "left" ? "left-4" : "right-4"
    } bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300`}
  >
    {direction === "left" ? <FaChevronLeft /> : <FaChevronRight />}
  </button>
);

const settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  prevArrow: <CustomArrow direction="left" />,
  nextArrow: <CustomArrow direction="right" />,
  dotsClass: "slick-dots !bottom-5",
  responsive: [
    {
      breakpoint: 9999,
      settings: {
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        dots: false,
      },
    },
  ],
  appendDots: (dots: React.ReactNode) => (
    <div className="hidden md:block">
      <ul className="flex justify-center gap-2"> {dots} </ul>
    </div>
  ),
  customPaging: () => (
    <div className="w-2 h-2 bg-gray-400/50 dark:bg-gray-600/50 rounded-full hover:bg-danger/50" />
  ),
};

const HeroSection: FC<Props> = () => {
  return (
    <div className="min-h-[400px] md:min-h-[500px] rounded-xl overflow-hidden bg-gradient-to-r from-[#faf7f2] to-[#f8f4ed] dark:from-gray-900 dark:to-gray-800 relative">
      <Slider {...settings}>
        {books.map((item) => (
          <div key={item.slug}>
            <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto">
              <div className="flex-1 flex flex-col justify-center p-4 md:p-12 space-y-4 md:space-y-6 text-center md:text-left">
                <div className="space-y-3 md:space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white leading-tight">
                    {item.slogan}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 italic">
                    {item.subtitle}
                  </p>
                </div>

                <Button
                  radius="sm"
                  color="danger"
                  variant="shadow"
                  endContent={<FaArrowRightLong />}
                  as={Link}
                  to={`/book/${item.slug}`}
                  className="w-fit mx-auto md:mx-0 hover:scale-105 transition-transform duration-300"
                >
                  Learn More
                </Button>
              </div>

              <div className="w-full md:w-auto p-4 pt-8 md:p-12 flex-1 flex items-center justify-center">
                <div className="relative group w-48 sm:w-56 md:w-64">
                  <div className="absolute inset-0 bg-gradient-to-r from-danger/20 to-primary/20 dark:from-danger/30 dark:to-primary/30 rounded-lg transform md:rotate-6 scale-105 transition-transform duration-500 ease-out shadow-[0_0_15px_rgba(0,0,0,0.2)]" />
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="relative w-full h-64 sm:h-72 md:h-96 object-cover rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.15)] transform md:rotate-6 group-hover:scale-105 md:group-hover:rotate-8 transition-all duration-500 ease-out"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
