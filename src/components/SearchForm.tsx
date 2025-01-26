import { Input } from "@nextui-org/react";
import { FC, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface Props {}

const SearchForm: FC<Props> = () => {
  const [query, setQuery] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  // const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
  //   evt.preventDefault();
  //   if (query.trim().length >= 3) {
  //     setIsLoading(true);
  //     try {
  //       await navigate("/search?title=" + query);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else toast.error("Invalid search query!");
  // };

  return (
    <form
      className={`relative transition-all duration-300 ease-in-out ${
        query ? "w-[280px]" : "w-[46px] focus-within:w-[280px]"
      }`}
      onSubmit={() => {
        console.log("search");
      }}
    >
      <Input
        classNames={{
          base: "h-[46px]",
          mainWrapper: "h-[46px]",
          input: [
            "text-medium",
            "placeholder:text-default-500/50",
            "!pl-12", // Make room for the search icon
            "transition-all",
            "duration-300",
            query ? "opacity-100" : "md:opacity-0 md:focus:opacity-100",
          ],
          inputWrapper: [
            "h-[46px]",
            "bg-default-100",
            "hover:bg-default-200",
            "group-data-[focused=true]:bg-default-100",
            "!cursor-text",
            "transition-colors",
            "duration-300",
            "rounded-full",
            "px-4",
            "border-none",
          ],
        }}
        placeholder="Search books..."
        value={query}
        onChange={({ target }) => setQuery(target.value)}
        startContent={
          <button
            type="submit"
            className={`absolute left-3 transition-transform duration-300 ${
              query ? "" : "md:scale-125 md:hover:scale-150"
            }`}
          >
            <HiMagnifyingGlass
              size={20}
              className="text-default-400 hover:text-primary transition-colors duration-300"
            />
          </button>
        }
        endContent={
          query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-default-400 hover:text-danger transition-colors duration-300 p-1 rounded-full hover:bg-default-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )
        }
      />
    </form>
  );
};

export default SearchForm;
