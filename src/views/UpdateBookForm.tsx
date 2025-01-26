import { FC, useEffect, useState } from "react";
import BookForm, { InitialBookToUpdate } from "../components/BookForm";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";

interface Props {}

const UpdateBookForm: FC<Props> = () => {
  const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
  const [busy, setBusy] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await client.get(`/book/details/${slug}`);
        setBookInfo(data.book);
      } catch (error) {
        ParseError(error);
        navigate("/dashboard/my-books");
      } finally {
        setBusy(false);
      }
    };
    fetchBook();
  }, [slug, navigate]);

  const handleSubmit = async (data: FormData, file?: File | null) => {
    try {
      const res = await client.patch("/book", data);
      console.log("file", file);
      console.log("res", res);
      if (res.data && file) {
        console.log("uploading file");
        axios.put(res.data, file, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
      }
      toast.success("Book updated successfully!");
      // navigate("/dashboard/my-books");
    } catch (error) {
      ParseError(error);
    }
  };

  if (busy)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner
          size="lg"
          // label={
          //   <span className="bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
          //     Loading book details...
          //   </span>
          // }
          classNames={{
            wrapper: "before:border-primary after:border-danger",
          }}
        />
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <BookForm
        title="Update Book"
        submitBtnTitle="Update"
        initialState={bookInfo}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UpdateBookForm;
