import { FC, useEffect } from "react";
import ePub from "epubjs";

interface Props {
 url?: Blob;
}

const container = "epub_container";

const EpubReader: FC<Props> = ({ url }) => {
 useEffect(() => {
  if (!url) return;

  const loadBook = async () => {
   const arrayBuffer = await url.arrayBuffer();
   const book = ePub(arrayBuffer);
   await book.ready;

   const rendition = book.renderTo(container, {
    width: "100%",
    height: "100%",
   });

   await rendition.display();
   await rendition.next();
  };

  loadBook();
 }, [url]);

 return (
  <div
   id={container}
   style={{
    height: "100vh",
    backgroundColor: "white",
   }}
  />
 );
};

export default EpubReader;
