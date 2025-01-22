import { FC, useEffect, useState } from "react";
import ePub, { Book, type NavItem, type Rendition } from "epubjs";
import Navigator from "./Navigator";
import LoadingIndicator from "./LoadingIndicator";
import TableOfContent, { type BookNavList } from "./TableOfContent";
import { IoMenu } from "react-icons/io5";
import { Button } from "@nextui-org/react";
import ThemeOptions, { type ThemeModes } from "./ThemeOptions";
import FontOptions from "./FontOptions";
import { MdOutlineStickyNote2 } from "react-icons/md";

interface Props {
  url?: Blob;
  title: string;
}

const container = "epub_container";
const wrapper = "epub_wrapper";
const DARK_THEME = {
  body: {
    color: "#f8f8ea !important",
    background: "#2B2B2B !important",
  },
  a: {
    color: "#f8f8ea !important",
  },
};
const LIGHT_THEME = {
  body: {
    color: "#000 !important",
    background: "#fff !important",
  },
  a: {
    color: "blue !important",
  },
};

const selectTheme = (rendition: Rendition, mode: ThemeModes) => {
  if (mode === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
  rendition.themes.select(mode);
};

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

const EpubReader: FC<Props> = ({ url, title }) => {
  const [book, setBook] = useState<Book>();
  const [rendition, setRendition] = useState<Rendition | undefined>();
  const [loading, setLoading] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [showToc, setShowToc] = useState(false);

  const handleThemeSelection = (mode: ThemeModes) => {
    if (!rendition) return;

    selectTheme(rendition, mode);
  };

  function toggleToc() {
    setShowToc(!showToc);
  }
  function hideToc() {
    setShowToc(false);
  }

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
    rendition.on("click", () => {
      console.log("click");
      hideToc();
    });

    rendition.themes.register("light", LIGHT_THEME);

    rendition.themes.register("dark", DARK_THEME);

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
    <div className="h-screen flex flex-col group dark:bg-book-dark dark:bg-text-book-dark">
      <LoadingIndicator visible={loading} />

      <div className="flex items-center h-14 shadow-md opacity-0 group-hover:opacity-100 transition">
        <div className="max-w-3xl md:mx-auto pl-5 md:pl-0">
          <h1 className="line-clamp-1 font-semibold text-lg">{title}</h1>
        </div>
        <div className="">
          <div className="flex items-center justify-center space-x-3">
            <FontOptions />
            <Button isIconOnly>
              <MdOutlineStickyNote2 size={30} />
            </Button>
            <ThemeOptions onThemeSelect={handleThemeSelection} />
            <Button onClick={() => toggleToc()} variant="light" isIconOnly>
              <IoMenu size={30} />
            </Button>
          </div>
        </div>
      </div>

      <div id={wrapper} className="h-full relative">
        <div id={container} />

        <Navigator
          side="left"
          onClick={() => {
            rendition?.prev();
            hideToc();
          }}
          className="opacity-0 group-hover:opacity-100"
        />
        <Navigator
          side="right"
          onClick={() => {
            rendition?.next();
            hideToc();
          }}
          className="opacity-0 group-hover:opacity-100"
        />
        <TableOfContent
          visible={showToc}
          data={tableOfContent}
          onClick={handleTocClick}
          currentLocation={currentLocation}
        />
      </div>
    </div>
  );
};

export default EpubReader;
