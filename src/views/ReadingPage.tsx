import { FC, useCallback, useEffect, useState } from "react";
import client from "../api/client";
import { useParams, useSearchParams } from "react-router-dom";
import { debounce, ParseError } from "../utils/helper";
import EpubReader, { Highlight } from "../components/reader";
import LoadingIndicator from "../components/reader/LoadingIndicator";

interface Props {}

interface BookAPIRes {
  settings: Settings;
  url: string;
}

type Settings = { highlights: Highlight[]; lastLocation: string };

const updateLastLocation = (bookId: string, lastLocation: string) => {
  client.post("/history", {
    bookId,
    lastLocation,
    remove: false,
  });
};

const debounceUpdateLastLocation = debounce(updateLastLocation, 1000);

const ReadingPage: FC<Props> = () => {
  const [url, setUrl] = useState<Blob>();
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [settings, setSettings] = useState<Settings>({
    highlights: [],
    lastLocation: "",
  });

  const title = searchParams.get("title");
  const bookId = searchParams.get("id");

  function handleOnHighlightSelection(data: Highlight) {
    try {
      setSettings({ ...settings, highlights: [...settings.highlights, data] });
      client.post("/history", {
        bookId,
        highlights: [data],
        remove: false,
      });
    } catch (error) {
      ParseError(error);
    }
  }
  function handleOnHighlightSelectionClear(cfi: string) {
    try {
      const newHighlights = settings.highlights.filter(
        (item) => item.selection !== cfi
      );
      setSettings({
        ...settings,
        highlights: newHighlights,
      });

      client.post("/history", {
        bookId,
        highlights: [{ selection: cfi, fill: "" }],
        remove: true,
      });
    } catch (error) {
      ParseError(error);
    }
  }

  const handleLocationChanged = useCallback(
    (location: string) => {
      try {
        if (bookId) debounceUpdateLastLocation(bookId, location);
      } catch (error) {
        ParseError(error);
      }
    },
    [bookId]
  );

  useEffect(() => {
    if (!slug) return;

    const fetchBookUrl = async () => {
      try {
        setLoading(true);

        const { data } = await client.get<BookAPIRes>(`/book/read/${slug}`);
        const res = await client.get(data.url, { responseType: "blob" });
        setUrl(res.data);
        setSettings(data.settings);
        // console.log(data);
      } catch (error) {
        ParseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookUrl();
  }, [slug]);

  if (loading) return <LoadingIndicator />;
  return (
    <EpubReader
      url={url}
      title={title ? title : ""}
      highlights={settings.highlights}
      lastLocation={settings.lastLocation}
      onHighlight={handleOnHighlightSelection}
      onHighlightClear={handleOnHighlightSelectionClear}
      onLocationChanged={handleLocationChanged}
    />
  );
};

export default ReadingPage;
