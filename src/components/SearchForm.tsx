import { Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {}

const SearchForm: FC<Props> = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    if (query.trim().length >= 3) {
      setIsLoading(true);
      try {
        await navigate("/search?title=" + query);
      } finally {
        setIsLoading(false);
      }
    } else toast.error("Invalid search query!");
  };

  return (
    <form className="w-full min-w-0 relative group" onSubmit={handleSubmit}>
      <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/20 to-danger/20 rounded-xl opacity-70 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur" />
      <Input
        isDisabled={isLoading}
        variant="bordered"
        placeholder="Search your book..."
        endContent={
          <button
            className="focus:outline-none transition-transform duration-300 hover:scale-110 text-default-500 hover:text-primary"
            type="submit"
          >
            <IoMdSearch size={24} />
          </button>
        }
        className="w-full shadow-lg bg-background/60 backdrop-blur-md hover:shadow-danger/25 transition-shadow duration-300"
        classNames={{
          input: "text-base",
          inputWrapper:
            "bg-transparent backdrop-blur-xl border-default-200/50 hover:border-primary/50 group-hover:border-primary transition-colors duration-300",
        }}
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
    </form>
  );
};

export default SearchForm;
