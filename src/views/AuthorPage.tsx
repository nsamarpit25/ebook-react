import { Card, Divider, Link, Skeleton } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import client from "../api/client";
import BookList, { Book } from "../components/BookList";
import RichEditor from "../components/rich-editor";
import useAuth from "../hooks/useAuth";
import { ParseError } from "../utils/helper";

interface Props {}

interface AuthorInfo {
  id: string;
  name: string;
  about: string;
  socialLinks: string[];
  books: Book[];
  avatar?: string;
}

const AuthorPage: FC<Props> = () => {
  const [fetching, setFetching] = useState(true);
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo>();
  const { id } = useParams();
  const { dbConnectionStatus } = useAuth();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, id]);

  useEffect(() => {
    if (!id) return;

    const fetchAuthorInfo = async () => {
      try {
        const { data } = await client.get(`/author/${id}`);
        setAuthorInfo(data);
      } catch (error) {
        ParseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchAuthorInfo();
  }, [id, dbConnectionStatus]);

  if (fetching) {
    return (
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <div className="space-y-4">
          <Skeleton className="rounded-xl h-[300px]" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <Card className="p-6 border-none bg-background/60 backdrop-blur-lg shadow-lg">
        <div className="flex flex-col items-center space-y-6 mb-8">
          {/* Author Avatar with gradient border */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-danger rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-white/20 dark:ring-black/20">
              {authorInfo?.avatar ? (
                <img
                  src={authorInfo.avatar}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-danger/10 flex items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                    {authorInfo?.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Author Name with gradient text */}
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
            {authorInfo?.name}
          </h1>

          {/* Social Links */}
          {authorInfo?.socialLinks && authorInfo.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {authorInfo.socialLinks.map((link) => {
                const { host } = new URL(link);
                return (
                  <Link
                    key={link}
                    href={link}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                      bg-content1/50 backdrop-blur-md hover:bg-content1
                      border border-default-200/50 transition-all duration-300
                      hover:scale-105 hover:shadow-lg group"
                  >
                    <FaGlobe className="text-primary group-hover:text-danger transition-colors duration-300" />
                    <span>{host.replace("www.", "")}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Divider className="my-8 bg-gradient-to-r from-primary/20 to-danger/20" />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
            About the Author
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <RichEditor
              editable={false}
              value={authorInfo?.about}
              className="text-lg leading-relaxed"
            />
          </div>
        </div>
      </Card>

      <div className="mt-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
            Books By {authorInfo?.name}
          </h2>
          <p className="text-default-500">
            Explore all books published by this author
          </p>
        </div>
        <BookList data={authorInfo?.books || []} />
      </div>
    </div>
  );
};

export default AuthorPage;
