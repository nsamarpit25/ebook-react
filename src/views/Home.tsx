import { FC } from "react";
import HeroSection from "../components/HeroSection";
import BookByGenre from "../components/BookByGenre";

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
    "Fantasy"
  ];

  return (
    <div className="min-h-screen bg-gray-50transition-colors duration-300">
      <div className="w-full">
        <HeroSection />
      </div>

      <main className="max-w-[1440px] mx-auto py-8 px-4 lg:px-0">
        <div className="space-y-16 scroll-smooth">
          {genres.map((genre) => (
            <section
              key={genre}
              className="scroll-mt-16 animate-fadeIn dark:text-gray-100"
              id={genre.toLowerCase()}
            >
              <BookByGenre genre={genre} />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
