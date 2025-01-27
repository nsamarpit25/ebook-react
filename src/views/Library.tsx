import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import { Link } from "react-router-dom";
import { Button, Card, Skeleton, Divider } from "@nextui-org/react";
import { FaBook, FaEdit, FaPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

interface Props {}

export interface BookDetail {
  id: string;
  title: string;
  cover?: string;
  slug: string;
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

const Library: FC<Props> = () => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<BookDetail[]>([]);
  const [createdBooks, setCreatedBooks] = useState<BookDetail[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const { data } = await client.get("/book/list");
        setBooks(data.books);
      } catch (error) {
        ParseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (profile?.authorId) {
      const fetchCreatedBooks = async () => {
        const { data } = await client.get(`/author/${profile.authorId}`);
        setCreatedBooks(data.books);
      };
      fetchCreatedBooks();
    }
  }, [profile?.authorId]);

  if (fetching) {
    return (
      <div className="container mx-auto max-w-7xl py-12 px-6 space-y-8">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="w-full h-[280px] rounded-2xl bg-background/60 backdrop-blur-sm"
          />
        ))}
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-6">
        <Card className="bg-background/60 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center gap-8 py-16 px-4">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full blur-lg animate-pulse" />
              <FaBook className="w-24 h-24 text-foreground/40 relative" />
            </div>
            <div className="text-center space-y-4 max-w-lg">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                Your library is empty
              </h2>
              <p className="text-foreground/60 text-xl leading-relaxed">
                Start your reading journey by adding books to your library
              </p>
            </div>
            <Button
              as={Link}
              to="/"
              color="primary"
              size="lg"
              className="font-semibold text-lg px-8 bg-gradient-to-r from-primary to-danger shadow-lg hover:shadow-primary/25"
            >
              Explore Books
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-6">
      <div className="space-y-16">
        <section>
          <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
            My Library
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {books.map((book) => (
              <Card
                key={book.id}
                className="group hover:shadow-xl transition-all duration-300 border-none bg-background/60 backdrop-blur-sm"
              >
                <div className="flex p-6 items-start gap-8">
                  <div className="relative w-40 h-56 flex-shrink-0 group">
                    <div className="absolute -inset-3 bg-gradient-to-tr from-primary/10 to-danger/10 rounded-xl opacity-75 blur transform group-hover:rotate-2 transition-transform duration-300" />
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-xl shadow-lg
                          transform transition-all duration-300
                          group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/25"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-default-100 rounded-xl flex items-center justify-center
                        transform transition-all duration-300 group-hover:scale-105"
                      >
                        <FaBook className="w-12 h-12 text-foreground/30" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0 space-y-4 py-2">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold line-clamp-2 text-foreground/90">
                        {book.title}
                      </h2>
                      <Link
                        to={`/author/${book.author.id}`}
                        className="text-primary hover:text-danger transition-colors text-lg"
                      >
                        By {book.author.name}
                      </Link>
                    </div>

                    <Button
                      as={Link}
                      to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                      className="w-full font-semibold text-lg bg-gradient-to-r from-primary to-danger shadow-lg
                        hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
                    >
                      Read Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
