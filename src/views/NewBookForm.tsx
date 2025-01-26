import { FC } from "react";
import BookForm from "../components/BookForm";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ParseError } from "../utils/helper";
import axios from "axios";

interface Props {}

const NewBookForm: FC<Props> = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: FormData, file?: File | null) => {
    try {
      const res = await client.post("/book/create", data);
      // console.log("url", res.data);
      // console.log(file);
      if (res.data && file) {
        axios.put(res.data, file, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
      }
      toast.success(
        "Book published successfully! It may take some time to reflect on the site.",
        { duration: 5000 }
      );
      navigate("/dashboard/my-books");
    } catch (error) {
      ParseError(error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <BookForm
        onSubmit={handleSubmit}
        title="Publish New Book"
        submitBtnTitle="Publish"
      />
    </div>
  );
};

export default NewBookForm;
