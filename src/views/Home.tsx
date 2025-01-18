import { FC } from "react";
import HeroSection from "../components/HeroSection";
import BookByGenre from "../components/BookByGenre";

// interface Props {}

const Home: FC = () => {
  return (
    <div className="space-y-10 px-5 lg:p-0">
      <HeroSection />
      <BookByGenre genre="Fiction" />
      <BookByGenre genre="Mystery" />
      <BookByGenre genre="Science Fiction" />
      <BookByGenre genre="Young Adult" />
      <BookByGenre genre="Horror" />
      <BookByGenre genre="Autobiography" />
      <BookByGenre genre="romance" />
      <BookByGenre genre="Self-Help" />
    </div>
  );
};

export default Home;
