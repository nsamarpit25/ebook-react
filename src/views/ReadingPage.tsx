import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { useParams, useSearchParams } from "react-router-dom";
import { ParseError } from "../utils/helper";
import EpubReader from "../components/reader";
import LoadingIndicator from "../components/reader/LoadingIndicator";

interface Props {}

interface BookAPIRes {
  settings: {
    higlists: string[];
    lastLocation: string;
  };
  url: string;
}

const ReadingPage: FC<Props> = () => {
  const [url, setUrl] = useState<Blob>();
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");

  useEffect(() => {
    if (!slug) return;

    const fetchBookUrl = async () => {
      try {
        setLoading(true);

        const { data } = await client.get<BookAPIRes>(`/book/read/${slug}`);
        const res = await client.get(data.url, { responseType: "blob" });
        setUrl(res.data);
      } catch (error) {
        ParseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookUrl();
  }, [slug]);

  if (loading) return <LoadingIndicator />;
  return <EpubReader url={url} title={title ? title : ""} />;
};

export default ReadingPage;
