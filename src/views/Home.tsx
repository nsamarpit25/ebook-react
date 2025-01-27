import { FC, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import BookByGenre from "../components/BookByGenre";
import { useLocation } from "react-router-dom";

const Home: FC = () => {
  const genres = [
    "Fiction",
    "Mystery",
    "Science Fiction",
    "Young Adult",
    "Horror",
    "Autobiography",
    "Romance",
    "Self-Help",
    "Fantasy",
  ];

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <section className="w-full mb-6 md:mb-12">
        <HeroSection />
      </section>

      <div className="space-y-12 md:space-y-24">
        {genres.map((genre, index) => (
          <section
            key={genre}
            className="scroll-mt-16 animate-fadeIn"
            id={genre.toLowerCase()}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <BookByGenre genre={genre} />
          </section>
        ))}
      </div>

      <div className="h-16 md:h-0" />
    </div>
  );
};

export default Home;
