import { FC, useEffect, useState } from "react";
import ePub, { Book, type Rendition } from "epubjs";
import Navigator from "./Navigator";
import LoadingIndicator from "./LoadingIndicator";
import TableOfContent, { type BookNavList } from "./TableOfContent";

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

const filterHref = (spineHrefList: string[], href: string) => {
  const foundItem = spineHrefList.find((spineHref) => {
    const regex = new RegExp("[^/]+/([^/]+.xhtml)");
    const list = regex.exec(spineHref);
    if (list) {
      if (href.startsWith(list[1])) {
        return true;
      }
    }
  });

  return foundItem || href;
};

const loadTableOfContent = async (book: Book) => {
  const [nav, spine] = await Promise.all([
    book.loaded.navigation,
    book.loaded.spine,
  ]);

  let spineHref: string[] = [];
  if (!Array.isArray(spine)) {
    const { spineByHref } = spine as { spineByHref: { [key: string]: number } };
    const entires = Object.entries(spineByHref);
    entires.sort((a, b) => a[1] - b[1]);
    spineHref = entires.map(([key]) => key);
  }

  const { toc } = nav;

  const navLabels: BookNavList[] = [];
  toc.forEach((item) => {
    if (item.subitems?.length) {
      navLabels.push({
        label: { title: item.label, href: filterHref(spineHref, item.href) },
        subItems: item.subitems.map(({ href, label }) => {
          return {
            href: filterHref(spineHref, href),
            title: label,
          };
        }),
      });
    } else {
      navLabels.push({
        label: { title: item.label, href: filterHref(spineHref, item.href) },
        subItems: [],
      });
    }
  });

  return navLabels;
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
          visible={showToc}
          data={tableOfContent}
          onClick={handleNavigation}
        />
      </div>
    </div>
  );
};

export default EpubReader;
