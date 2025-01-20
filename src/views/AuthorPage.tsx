import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import { Link, Card, Skeleton, Divider } from "@nextui-org/react";
import RichEditor from "../components/rich-editor";
import BookList, { Book } from "../components/BookList";
import { FaGlobe } from "react-icons/fa";

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

  useEffect(() => {
    if (!id) return;

    const fetchAuthorInfo = async () => {
      try {
        const { data } = await client.get(`/author/${id}`);
        setAuthorInfo(data);
        console.log(data)
      } catch (error) {
        ParseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchAuthorInfo();
  }, [id]);

  if (fetching) {
    return (
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <Skeleton className="rounded-xl h-[300px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">

      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4 mb-8">
          {/* Author Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden">
            {authorInfo?.avatar ? (
              <img
                src={authorInfo.avatar}
                alt={authorInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {authorInfo?.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Author Name */}
          <h1 className="text-3xl font-bold text-center">{authorInfo?.name}</h1>

          {/* Social Links */}
          {authorInfo?.socialLinks && authorInfo.socialLinks.length > 0 ?
           (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {authorInfo.socialLinks.map((link) => {
                const { host } = new URL(link);
                return (
                  <Link
                    key={link}
                    href={link}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-default-100 hover:bg-default-200"
                  >
                    <FaGlobe className="text-default-500" />
                    <span>{host.replace("www.", "")}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <Divider />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <RichEditor
            editable={false}
            value={authorInfo?.about}
            className="prose dark:prose-invert max-w-none text-lg regular"
          />
        </div>
      </Card>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Books By {authorInfo?.name}
        </h2>
        <BookList data={authorInfo?.books || []} />
      </div>
    </div>
  );
};

export default AuthorPage;
