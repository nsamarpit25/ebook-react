import { Button } from "@nextui-org/react";
import React, { FC } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";

interface Props {}

// const books = [
//     {
//         title: "The Girl with the Dragon Tattoo",
//         slogan: "Journalist Mikael Blomkvist and hacker Lisbeth Salander uncover dark secrets as they investigate a decades-old disappearance. Stieg Larsson's gripping thriller combines intricate plotting, compelling characters, and social commentary.",
//         subtitle: "The Millennium Trilogy Book 1",
//         cover:
//           "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943170/wiayfy2opfmbm5zztdut.png",
//         slug: "the-girl-with-the-dragon-tattoo-66d08b40ab9726b8a14859d9",
//       },
//     {
//         title: "The Road",
//         slogan: "Cormac McCarthy's post-apocalyptic novel follows a father and son as they journey through a ravaged landscape in search of hope and redemption. Against a backdrop of desolation, McCarthy explores themes of survival, love, and the human spirit.",
//         subtitle: "The Millennium Trilogy Book 1",
//         cover:
//           "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943172/bycfvhs8st7eosdimqwy.png",
//         slug: "the-road-66d08b40ab9726b8a14859d8",
//       },
//     {
//         title: "The Great Gatsby",
//         slogan: "A gripping thriller of mystery and suspense.",
//         subtitle: "The Millennium Trilogy Book 1",
//         cover:
//           "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943178/nh5py32h7elbcawjpux5.png",
//         slug: "the-great-gatsby-66d08b40ab9726b8a14859d4",
//       },
//     {
//         title: "Pride and Prejudice",
//         slogan: "Jane Austen's classic novel follows the romantic entanglements of the Bennet sisters as they navigate the societal expectations of 19th-century England. With wit, charm, and timeless characters, Austen explores themes of love, marriage, and social class.",
//         subtitle: "The Millennium Trilogy Book 1",
//         cover:
//           "https://res.cloudinary.com/dumq9n29v/image/upload/v1724943181/dszmpqruxweg5kpgxd3o.png",
//         slug: "the-girl-with-the-dragon-tattoo-66d08b40ab9726b8a14859d9",
//       },

// ];

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
  speed: 1000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

const HeroSection: FC<Props> = () => {
  return (
    <div className="md:h-96 rounded-medium p-5 bg-[#faf7f2] dark:bg-[#231e1a]">
      <Slider {...settings}>
        {books.map((item) => {
          return (
            <div key={item.slug}>
              <div className="md:flex justify-between">
                <div className="flex-1 flex flex-col justify-center p-5">
                  <h1 className="lg:text-6xl text-3xl">{item.slogan}</h1>
                  <p className="md:text-lg mt-3 italic">{item.subtitle}</p>
                  <div className="mt-3">
                    <Button
                      radius="sm"
                      color="danger"
                      variant="bordered"
                      endContent={<FaArrowRightLong />}
                      as={Link}
                      to={`/book/${item.slug}`}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex items-center justify-center">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="md:w-48 md:h-80 w-32 rounded-md object-cover shadow-lg rotate-12"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default HeroSection;
