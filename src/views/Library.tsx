import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import { Link } from "react-router-dom";
import { Button, Card, Skeleton, Divider } from "@nextui-org/react";
import { FaBook, FaEdit } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

interface Props {}

interface BookDetail {
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
      fetchCreatedBooks()
    }
    
  }, [profile?.authorId]);

  if (fetching) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <Skeleton className="w-full h-[200px] rounded-lg mb-4" />
        <Skeleton className="w-full h-[200px] rounded-lg mb-4" />
        <Skeleton className="w-full h-[200px] rounded-lg" />
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="container mx-auto max-w-5xl p-6 text-center">
        <div className="flex flex-col items-center gap-4 p-12">
          <FaBook className="w-16 h-16 text-default-300" />
          <h2 className="text-2xl font-bold text-default-600">
            Your library is empty
          </h2>
          <p className="text-default-500">
            Books you add to your library will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-8">My Library</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <Card key={book.id} className="w-full">
                <div className="flex p-3 items-start gap-4">
                  <div className="w-24 h-32 flex-shrink-0">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-md shadow-sm transition-transform duration-200 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-default-100 rounded-md flex items-center justify-center">
                        <FaBook className="w-8 h-8 text-default-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h2 className="text-lg font-semibold truncate">{book.title}</h2>

                    <Link
                      to={`/author/${book.author.id}`}
                      className="text-primary hover:opacity-80 text-sm mt-1 block"
                    >
                      By {book.author.name}
                    </Link>

                    <div className="mt-3">
                      <Button
                        as={Link}
                        to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                        color="primary"
                        size="sm"
                      >
                        Read Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {createdBooks?.length > 0 && (
          <>
            <Divider className="my-8" />
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Books Created By You</h2>
                <Button
                  as={Link}
                  to="/create-new-book"
                  color="primary"
                  variant="flat"
                >
                  Create New Book
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {createdBooks.map((book) => (
                  <Card key={book.id} className="w-full">
                    <div className="flex p-3 items-start gap-4">
                      <div className="w-24 h-32 flex-shrink-0">
                        {book.cover ? (
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-md shadow-sm transition-transform duration-200 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-default-100 rounded-md flex items-center justify-center">
                            <FaBook className="w-8 h-8 text-default-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h2 className="text-lg font-semibold truncate">
                          {book.title}
                        </h2>

                        <div className="mt-3 flex gap-2">
                          <Button
                            as={Link}
                            to={`/book/${book.slug}`}
                            color="primary"
                            size="sm"
                          >
                            Read Now
                          </Button>
                          <Button
                            as={Link}
                            to={`/update-book/${book.slug}`}
                            variant="flat"
                            size="sm"
                            startContent={<FaEdit />}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Library;
