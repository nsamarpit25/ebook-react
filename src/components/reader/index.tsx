import { FC, useCallback, useEffect, useState } from "react";
import ePub, { Book, type NavItem, type Rendition } from "epubjs";
import Navigator from "./Navigator";
import LoadingIndicator from "./LoadingIndicator";
import TableOfContent, { type BookNavList } from "./TableOfContent";
import { IoMenu } from "react-icons/io5";
import { button, Button } from "@nextui-org/react";
import ThemeOptions, { type ThemeModes } from "./ThemeOptions";
import FontOptions from "./FontOptions";
import { MdOutlineStickyNote2 } from "react-icons/md";
import type { LocationChangedEvent, RelocatedEvent } from "./types";
import HighlightOptions from "./HighlightOption";
import { debounce } from "../../utils/helper";
import NotesModal from "./NotesModal";

interface Props {
  url?: Blob;
  title: string;

  highlights: Highlight[];
  onHighlight: (data: Highlight) => void;
  onHighlightClear: (cfi: string) => void;
  onLocationChanged: (location: string) => void;
  lastLocation?: string;
}

export type Highlight = {
  selection: string;
  fill: string;
};

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

  // console.log(toc);

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

// Event listeners for navigation

const applyHighlight = (rendition: Rendition, highlights: Highlight[]) => {
  highlights.forEach((highlight) => {
    rendition.annotations.remove(highlight.selection, "highlight");

    rendition.annotations.highlight(
      highlight.selection,
      undefined,
      undefined,
      undefined,
      {
        fill: highlight.fill,
      }
    );
  });
};

const EpubReader: FC<Props> = ({
  url,
  title,
  highlights,
  onHighlight,
  onHighlightClear,
  onLocationChanged,
  lastLocation,
}) => {
  const [book, setBook] = useState<Book>();
  const [rendition, setRendition] = useState<Rendition | undefined>();
  const [loading, setLoading] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<BookNavList[]>([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [showToc, setShowToc] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 23,
    currentLocation: "",
  });
  const [page, setPage] = useState({ start: 0, end: 0, total: 0 });
  const [showHighlightOption, setShowHighlightOption] = useState(false);
  const [selectedCfi, setSelectedCfi] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [locationBeforeNoteOpen, setLocationBeforeNoteOpen] = useState("");

  const updatePageNumber = (rendition: Rendition) => {
    const location = rendition.currentLocation() as unknown as RelocatedEvent;
    const start = location.start.displayed.page;
    const end = location.end.displayed.page;
    const total = location.start.displayed.total;
    setPage({ start, end, total });
  };

  const keyListener = useCallback(
    (e: KeyboardEvent) => {
      if (!rendition) return;
      if (e.key === "ArrowLeft") rendition.prev();
      if (e.key === "ArrowRight") rendition.next();
    },
    [rendition]
  );

  useEffect(() => {
    if (!rendition) return;

    // Add document level listener
    document.addEventListener("keyup", keyListener);

    // Add rendition level listener
    rendition.on("keyup", keyListener);

    // Cleanup
    return () => {
      document.removeEventListener("keyup", keyListener);
      rendition.off("keyup", keyListener);
    };
  }, [rendition, keyListener]);

  const handleThemeSelection = (mode: ThemeModes) => {
    if (!rendition) return;

    selectTheme(rendition, mode);
  };

  const handleFontSizeUpdate = (mode: "increase" | "decrease") => {
    if (!rendition) return;
    let { fontSize } = settings;
    if (mode === "increase") {
      fontSize += 2;
    }

    if (mode === "decrease") {
      fontSize -= 2;
    }
    rendition.themes.fontSize(String(fontSize + "px"));
    setSettings({ ...settings, fontSize });
    updatePageNumber(rendition);
  };

  function toggleToc() {
    setShowToc(!showToc);
  }

  function hideToc() {
    setShowToc(false);
  }

  const handleTocClick = (href: string) => {
    if (rendition) {
      rendition.display(href);
      setCurrentLocation(href);
      // console.log(currentLocation);
      // console.log(href);
    }
    // console.log(book);
  };

  function handleHighlightSelection(fill: string) {
    if (!rendition) return;
    const newHighlight = { fill, selection: selectedCfi };
    applyHighlight(rendition, [newHighlight]);
    setShowHighlightOption(false);
    onHighlight(newHighlight);
  }
  function handleOnNoteClick(path: string) {
    if (!locationBeforeNoteOpen)
      setLocationBeforeNoteOpen(settings.currentLocation);
    handleTocClick(path);
  }

  function handleOnHighlightClear() {
    if (!rendition) return;

    rendition.annotations.remove(selectedCfi, "highlight");
    setShowHighlightOption(false);
    onHighlightClear(selectedCfi);
  }

  // Initialize book
  useEffect(() => {
    if (!url) return;
    let book: Book;

    const loadBook = async () => {
      setLoading(true);
      const arrayBuffer = await url.arrayBuffer();
      const EpubBook = ePub(arrayBuffer as any);
      await EpubBook.ready;
      setBook(EpubBook);
      book = EpubBook;
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
        if (lastLocation !== "") {
          await rendition.display(lastLocation);
        } else {
          await rendition.display();
        }
        await rendition.display(lastLocation);
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
      setSettings({ ...settings, currentLocation: location.end.href });
      // console.log(location);
    });

    rendition.on("click", () => {
      // console.log("click");

      hideToc();
    });

    rendition.on("displayed", () => {
      updatePageNumber(rendition);
      // rendition.annotations.highlight(
      //   "epubcfi(/6/8!/4/2/2/6,/1:1,/1:10)",
      //   undefined,
      //   undefined,
      //   undefined,
      //   {
      //     fill: "yellow",
      //     color: "red",
      //   }
      // );
    });

    rendition.on("locationChanged", (evt: LocationChangedEvent) => {
      onLocationChanged(evt.start);
      updatePageNumber(rendition);
    });

    const debounceSetShowHighlightOption = debounce(
      setShowHighlightOption,
      3000
    );

    rendition.on("selected", (cfi: string) => {
      setShowHighlightOption(true);
      setSelectedCfi(cfi);
      debounceSetShowHighlightOption(false);
    });

    rendition.on("markClicked", (cfi: string) => {
      setShowHighlightOption(true);
      setSelectedCfi(cfi);
      console.log(cfi);
      debounceSetShowHighlightOption(false);
    });

    rendition.themes.register("light", LIGHT_THEME);

    rendition.themes.register("dark", DARK_THEME);

    document.addEventListener("keyup", (e) => {
      keyListener(e, rendition);
    });
    return () => {
      document.removeEventListener("keyup", (e) => {
        keyListener(e, rendition);
      });
    };
  }, [rendition, book, lastLocation]);

  useEffect(() => {
    if (!rendition) {
      return;
    }
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || theme === "light") selectTheme(rendition, theme);
    rendition.themes.fontSize(settings.fontSize + "px");

    // console.log(highlights);

    rendition.on("locationChanged", () => {
      applyHighlight(rendition, highlights);
    });
  }, [rendition, highlights]);

  return (
    <div className="h-screen flex flex-col group dark:bg-book-dark dark:bg-text-book-dark">
      <LoadingIndicator visible={loading} />

      <div className="flex items-center h-14 shadow-sm opacity-0 group-hover:opacity-100 transition">
        <div className="max-w-3xl md:mx-auto pl-5 md:pl-0">
          <h1 className="line-clamp-1 font-semibold text-lg">{title}</h1>
        </div>
        <div className="">
          <div className="flex items-center justify-center space-x-3">
            <FontOptions
              onFontDecrease={() => {
                handleFontSizeUpdate("decrease");
              }}
              onFontIncrease={() => {
                handleFontSizeUpdate("increase");
              }}
            />
            <Button
              isIconOnly
              variant="light"
              onClick={() => {
                setShowNotes(true);
              }}
            >
              <MdOutlineStickyNote2 size={30} />
            </Button>
            <ThemeOptions onThemeSelect={handleThemeSelection} />
            <Button onClick={() => toggleToc()} variant="light" isIconOnly>
              <IoMenu size={30} />
            </Button>
            {/* <Button onClick={currentLocationFunc} variant="light" isIconOnly>
              <IoMenu size={30} />
            </Button> */}
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

        <HighlightOptions
          visible={showHighlightOption}
          onSelect={handleHighlightSelection}
          onClear={handleOnHighlightClear}
        />
        <NotesModal
          book={rendition?.book}
          notes={highlights.map(({ selection }) => selection)}
          isOpen={showNotes}
          onClose={() => {
            setShowNotes(false);
          }}
          onNoteClick={handleOnNoteClick}
        />
      </div>
      <div className="h-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex-1 text-center">
          <p> Page {`${page.start} - ${page.total}`}</p>
        </div>

        {locationBeforeNoteOpen ? (
          <button
            onClick={() => {
              setLocationBeforeNoteOpen("");
              handleTocClick(settings.currentLocation);
            }}
          >
            Go to previous location
          </button>
        ) : null}

        {page.start === page.end ? null : (
          <div className="flex-1 text-center">
            <p> Page {`${page.end} - ${page.total}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpubReader;
