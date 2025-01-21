import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { useParams } from "react-router-dom";
import { ParseError } from "../utils/helper";
import EpubReader from "../components/reader";

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

  if (loading) return <div>Loading...</div>;
  return <EpubReader url={url} />;
};

export default ReadingPage;
