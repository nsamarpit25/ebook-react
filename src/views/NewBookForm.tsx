import { FC } from "react";
import BookForm from "../components/BookForm";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ParseError } from "../utils/helper";

interface Props {}

const NewBookForm: FC<Props> = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: FormData) => {
    try {
      await client.post("/book/create", data);
      toast.success("Book published successfully!");
      navigate("/dashboard/my-books");
    } catch (error) {
      ParseError(error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <BookForm
        onSubmit={handleSubmit}
        title="Publish New Book"
        submitBtnTitle="Publish"
      />
    </div>
  );
};

export default NewBookForm;
