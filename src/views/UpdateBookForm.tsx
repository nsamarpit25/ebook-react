import { FC, useEffect, useState } from "react";
import BookForm, { InitialBookToUpdate } from "../components/BookForm";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Props {}

const UpdateBookForm: FC<Props> = () => {
  const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
  const [busy, setBusy] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await client.get(`/book/details/${slug}`);
        setBookInfo(data.book);
      } catch (error) {
        console.log("hey from catch block");
        ParseError(error);
      } finally {
        setBusy(false);
      }
    };
    fetchBook();
  }, [slug]);

  const handleSubmit = async (data: FormData) => {
    const res = await client.patch("/book", data);
    console.log(res.data);
  };

  if (busy) return <LoadingSpinner />;

  return (
    <BookForm
      title="Update Book"
      submitBtnTitle="Update"
      initialState={bookInfo}
      onSubmit={handleSubmit}
    />
  );
};

export default UpdateBookForm;
