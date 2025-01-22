import { FC, useEffect, useState } from "react";
import ePub, { Book, type NavItem, type Rendition } from "epubjs";
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

  let { toc }: { toc: NavItem[] } = nav;
  // toc = toc[0].subitems;
  // let mainBook: NavItem | undefined;
  if (toc.length < 2 && toc[0].subitems) {
    toc = toc[0].subitems;
  }

  console.log(toc);

  const navLabels: BookNavList[] = [];
  if (Array.isArray(toc))
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

  // console.log(navLabels);

  return navLabels;
};

const EpubReader: FC<Props> = ({ url }) => {
  const [book, setBook] = useState<Book>();
  const [rendition, setRendition] = useState<Rendition | undefined>();
  const [loading, setLoading] = useState(true);
  const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
  const [currentLocation, setCurrentLocation] = useState("");

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
    if (!rendition || !book) return;

    const display = async () => {
      try {
        await rendition.display();
        const toc = await loadTableOfContent(book);
        setTableOfContent(toc);
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setLoading(false);
      }
    };

    display();

    rendition.on("relocated", (location: any) => {
      setCurrentLocation(location.end.href);
      console.log(location);
    });

    // Event listeners for navigation
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") rendition.prev();
      if (e.key === "ArrowRight") rendition.next();
    };

    document.addEventListener("keyup", keyListener);
    return () => {
      document.removeEventListener("keyup", keyListener);
    };
  }, [rendition, book]);

  const handleTocClick = (href: string) => {
    if (rendition) {
      rendition.display(href);
      setCurrentLocation(href);
      // console.log(currentLocation);
      // console.log(href);
    }
    // console.log(book);
  };

  return (
    <div className="h-screen">
      <LoadingIndicator visible={loading} />
      <div id={wrapper} className="h-full relative group">
        <div id={container} />
        <Navigator
          side="left"
          onClick={() => rendition?.prev()}
          className="opacity-0 group-hover:opacity-100"
        />
        <Navigator
          side="right"
          onClick={() => rendition?.next()}
          className="opacity-0 group-hover:opacity-100"
        />
        <TableOfContent
          visible={true}
          data={tableOfContent}
          onClick={handleTocClick}
          currentLocation={currentLocation}
        />
      </div>
    </div>
  );
};

export default EpubReader;
