import { FC, useEffect, useState } from "react";
import ePub, { Book, type Rendition } from "epubjs";
import Navigator from "./Navigator";
import LoadingIndicator from "./LoadingIndicator";
import TableOfContent from "./TableOfContent";

interface Props {
  url?: Blob;
}

const container = "epub_container";
const wrapper = "epub_wrapper";

const getElementSize = (id: string) => {
  const elm = document.getElementById(id);
  let width = 0;
  let height = 0;
  if (elm) {
    const res = elm.getBoundingClientRect();
    width = res.width;
    height = res.height;
  }
  return { width, height };
};

const loadTableOfContent = async (book: Book) => {
  const [nav, spine] = await Promise.all([
    book.loaded.spine,
    book.loaded.navigation,
  ]);
  console.log(nav, spine);
};

const EpubReader: FC<Props> = ({ url }) => {
  const [book, setBook] = useState<Book>();
  const [rendition, setRendition] = useState<Rendition | undefined>();
  const [loading, setLoading] = useState(true);

  // Initialize book
  useEffect(() => {
    if (!url) return;

    const loadBook = async () => {
      setLoading(true);
      const arrayBuffer = await url.arrayBuffer();
      const EpubBook = ePub(arrayBuffer as any);
      await EpubBook.ready;
      setBook(EpubBook);
    };

    loadBook();

    return () => {
      if (book) book.destroy();
    };
  }, [url]); // Only depend on url changes

  // Initialize rendition
  useEffect(() => {
    if (!book) return;

    const { height, width } = getElementSize(wrapper);
    const EpubRendition = book.renderTo(container, {
      width: width,
      height: height,
    });
    setRendition(EpubRendition);

    return () => {
      if (EpubRendition) EpubRendition.destroy();
    };
  }, [book]); // Only depend on book changes

  // Display content
  useEffect(() => {
    if (!rendition) return;

    const display = async () => {
      // book?.loaded.navigation.then(console.log);
      await rendition.display();
      if (book) loadTableOfContent(book);
      rendition.on("rendered", () => {
        rendition.display(
          "7495267509099878357_75163-h-5.htm.xhtml#pgepubid00018"
        );
        setLoading(false);
      });
    };

    display();
  }, [rendition]); // Only depend on rendition changes

  return (
    <div className="h-screen">
      <LoadingIndicator visible={loading} />
      <div id={wrapper} className="h-full relative group">
        <div id={container} />
        <Navigator
          side="left"
          onClick={() => {
            rendition?.prev();
          }}
          className="opacity-0 group-hover:opacity-100"
        />
        <Navigator
          side="right"
          onClick={() => {
            rendition?.next();
          }}
          className="opacity-0 group-hover:opacity-100"
        />

        <TableOfContent
          data={[
            {
              label: { title: "", href: "" },
              subItems: [{ title: "", href: "" }],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default EpubReader;
