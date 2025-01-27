import { FC, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Avatar, Button, Card, Divider } from "@nextui-org/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import client from "../api/client";
import type { BookDetail } from "./Library";
import { FaBook, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { ParseError } from "../utils/helper";

interface Props {}

const Profile: FC<Props> = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  // const [books, setBooks] = useState<BookDetail[]>([]);
  const [createdBooks, setCreatedBooks] = useState<BookDetail[]>([]);

  useEffect(() => {
    if (profile?.authorId) {
      const fetchCreatedBooks = async () => {
        try {
          setFetching(true);
          const { data } = await client.get(`/author/${profile.authorId}`);
          setCreatedBooks(data.books);
        } catch (error) {
          ParseError(error);
        } finally {
          setFetching(false);
        }
      };
      fetchCreatedBooks();
    }
  }, [profile?.authorId]);

  if (!profile) return <Navigate to="/sign-up" />;

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-8 relative group">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-danger/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative">
            {/* Avatar with gradient ring */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-danger rounded-lg opacity-0 group-hover:opacity-25 blur-sm transition-opacity duration-300" />
              <Avatar
                src={profile?.avatar}
                className="w-20 h-20 sm:w-24 sm:h-24"
                radius="lg"
                name={profile?.name}
                showFallback
                classNames={{
                  base: "border-2 border-content2 relative",
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                {profile.name}
              </h2>
              <p className="text-sm sm:text-base text-foreground-500 mt-1">
                {profile.email}
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between">
                <div className="bg-content2/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-foreground-500 mr-2">Role:</span>
                  <span className="font-semibold text-foreground">
                    {profile.role.toUpperCase()}
                  </span>
                </div>

                {profile.role === "user" ? (
                  <Link
                    className="text-primary hover:text-danger font-medium transition-colors text-sm sm:text-base"
                    to="/author-registration"
                  >
                    Become an Author
                  </Link>
                ) : (
                  <Link
                    className="text-primary hover:text-danger font-medium transition-colors text-sm sm:text-base"
                    to="/update-author"
                  >
                    Update Author Profile
                  </Link>
                )}
              </div>
            </div>

            <Button
              className="fixed sm:absolute right-6 top-6 sm:right-4 sm:top-4 z-10
                bg-content2/50 backdrop-blur-sm hover:bg-content3/50 transition-colors"
              radius="full"
              isIconOnly
              onClick={() => navigate("/update-profile")}
            >
              <BsPencilSquare className="text-foreground-500" />
            </Button>
          </div>
        </div>
      </div>

      {createdBooks?.length > 0 && (
        <section>
          <Divider className="my-12 opacity-50" />
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                Your Books
              </h2>
              <Button
                as={Link}
                to="/create-new-book"
                className="font-semibold text-lg px-8 bg-gradient-to-r from-primary to-danger
                    shadow-lg hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
                startContent={<FaPlus className="text-xl" />}
              >
                Create New Book
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {createdBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group hover:shadow-xl transition-all duration-300 border-none bg-background/60 backdrop-blur-sm"
                >
                  {/* Same card content structure as above but with edit button */}
                  <div className="flex p-6 items-start gap-8">
                    <div className="relative w-40 h-56 flex-shrink-0 group">
                      {/* Same image section as above */}
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
                      <h2 className="text-2xl font-semibold line-clamp-2 text-foreground/90">
                        {book.title}
                      </h2>

                      <div className="flex gap-4">
                        <Button
                          as={Link}
                          to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                          className="flex-1 font-semibold text-lg bg-gradient-to-r from-primary to-danger
                              shadow-lg hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
                        >
                          Read
                        </Button>
                        <Button
                          as={Link}
                          to={`/update-book/${book.slug}`}
                          variant="flat"
                          className="font-semibold text-lg px-8 bg-gradient-to-r from-secondary to-secondary/50
                              shadow-lg hover:shadow-secondary/25 hover:opacity-90 transition-all duration-300"
                          startContent={<FaEdit className="text-xl" />}
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
        </section>
      )}
    </div>
  );
};

export default Profile;
