import { Button, Card } from "@nextui-org/react";
import { FC } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";

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
  arrows: false,
  customPaging: () => (
    <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-danger/60 transition-colors duration-300" />
  ),
  dotsClass: "slick-dots !bottom-8",
};

const HeroSection: FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 " />
      <Slider {...settings}>
        {books.map((item) => (
          <div key={item.slug} className="relative">
            <div className="min-h-[500px] md:min-h-[600px] flex items-center">
              <Card className="w-full bg-background/60 backdrop-blur-sm border-none shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-8 lg:p-12">
                  <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                        {item.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-foreground/80">
                        {item.slogan}
                      </p>
                      <p className="text-lg text-foreground/60 italic">
                        {item.subtitle}
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

                  {/* Updated image container */}
                  <div className="relative w-48 sm:w-56 md:w-72 lg:w-80">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-danger/10 rounded-xl opacity-75 blur transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-2" />
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="relative w-full h-auto rounded-xl shadow-2xl
                        transform rotate-3 transition-all duration-500
                        hover:rotate-2 hover:scale-105 hover:shadow-danger/20 "
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
