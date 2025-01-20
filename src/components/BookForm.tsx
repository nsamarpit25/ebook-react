import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
} from "@nextui-org/react";
import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { genreList, genres, languageList, languages } from "../utils/data";
import PosterSelector from "./PosterSelector";
import RichEditor from "./rich-editor";
import { parseDate } from "@internationalized/date";
import { z } from "zod";
import ErrorList from "./common/ErrorList";
import clsx from "clsx";
import { ParseError } from "../utils/helper";
import toast from "react-hot-toast";

export interface InitialBookToUpdate {
  id: string;
  slug: string;
  title: string;
  description: string;
  genre: string;
  language: string;
  cover?: string;
  price: { mrp: string; sale: string };
  publicationName: string;
  publishedAt: string;
}

interface Props {
  title: string;
  submitBtnTitle: string;
  initialState?: InitialBookToUpdate;
  onSubmit(data: FormData): Promise<void>;
}

interface DefaultForm {
  file?: File | null;
  cover?: File;
  title: string;
  description: string;
  publicationName: string;
  publishedAt?: string;
  genre: string;
  language: string;
  mrp: string;
  sale: string;
}

const defaultBookInfo = {
  title: "",
  description: "",
  language: "",
  genre: "",
  mrp: "",
  publicationName: "",
  sale: "",
};

interface BookToSubmit {
  title: string;
  description: string;
  uploadMethod: "aws" | "local";
  language: string;
  publishedAt?: string;
  slug?: string;
  publicationName: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
  };
  fileInfo?: {
    type: string;
    name: string;
    size: number;
  };
}

const commonBookSchema = {
  title: z.string().trim().min(5, "Title is too short!"),
  description: z.string().trim().min(5, "Description is too short!"),
  genre: z.enum(genreList, { message: "Please select a genre!" }),
  language: z.enum(languageList, { message: "Please select a language!" }),
  publicationName: z
    .string({ required_error: "Invalid publication name!" })
    .trim()
    .min(3, "Publication Name is too short!"),
  uploadMethod: z.enum(["aws", "local"], {
    message: "Upload method is missing!",
  }),
  publishedAt: z.string({ required_error: "Publish date is missing!" }).trim(),
  price: z
    .object({
      mrp: z
        .number({ required_error: "MRP is missing!" })
        .refine((val) => val > 0, "MRP is missing!"),
      sale: z
        .number({ required_error: "Sale price is missing!" })
        .refine((val) => val > 0, "Sale price is missing!"),
    })
    .refine((price) => price.sale <= price.mrp, "Invalid sale price!"),
};

const fileInfoSchema = z.object({
  name: z
    .string({ required_error: "File name is missing!" })
    .min(1, "File name is missing!"),
  type: z
    .string({ required_error: "File type is missing!" })
    .min(1, "File type is missing!"),
  size: z
    .number({ required_error: "File size is missing!" })
    .refine((val) => val > 0, "Invalid file size!"),
});

const newBookSchema = z.object({
  ...commonBookSchema,
  fileInfo: fileInfoSchema,
});
const updateBookSchema = z.object({
  ...commonBookSchema,
  fileInfo: fileInfoSchema.optional(),
});

const BookForm: FC<Props> = ({
  title,
  submitBtnTitle,
  onSubmit,
  initialState,
}) => {
  const [bookInfo, setBookInfo] = useState<DefaultForm>(defaultBookInfo);
  const [cover, setCover] = useState("");
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { value, name } = target;

    setBookInfo({ ...bookInfo, [name]: value });
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files, name } = target;

    if (!files) return;

    const file = files[0];

    if (name === "cover") {
      try {
        setCover(URL.createObjectURL(file));
      } catch (e) {
        console.error(e);
        setCover("");
      }
    }

    setBookInfo({ ...bookInfo, [name]: file });
  };

  const handleBookPublish = async () => {
    setBusy(true);
    try {
      const formData = new FormData();

      const { file, cover } = bookInfo;

      // Validate book file (must be epub type)
      if (file?.type !== "application/epub+zip") {
        return setErrors({
          ...errors,
          file: ["Please select a valid (.epub) file."],
        });
      } else {
        setErrors({
          ...errors,
          file: undefined,
        });
      }

      // Validate cover file
      if (cover && !cover.type.startsWith("image/")) {
        return setErrors({
          ...errors,
          cover: ["Please select a valid poster file."],
        });
      } else {
        setErrors({
          ...errors,
          cover: undefined,
        });
      }

      if (cover) {
        formData.append("cover", cover);
      }

      // validate data for book creation
      const bookToSend: BookToSubmit = {
        title: bookInfo.title,
        description: bookInfo.description,
        genre: bookInfo.genre,
        language: bookInfo.language,
        publicationName: bookInfo.publicationName,
        uploadMethod: "local",
        publishedAt: bookInfo.publishedAt,
        price: {
          mrp: Number(bookInfo.mrp),
          sale: Number(bookInfo.sale),
        },
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      };

      const result = newBookSchema.safeParse(bookToSend);
      if (!result.success) {
        return setErrors(result.error.flatten().fieldErrors);
        // setErrors(result.error.flatten().fieldErrors);
      }

      if (result.data.uploadMethod === "local") {
        formData.append("book", file);
      }

      for (const key in bookToSend) {
        type keyType = keyof typeof bookToSend;
        const value = bookToSend[key as keyType];

        if (typeof value === "string") {
          formData.append(key, value);
        }

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        }
      }

      await onSubmit(formData);
      setBookInfo({ ...defaultBookInfo, file: null });
      setCover("");
      toast.success("Congratulations!! Your book have been published.", {
        position: "top-right",
        duration: 5000,
      });

      // console.log(result.data);
    } catch (error) {
      ParseError(error);
    } finally {
      setBusy(false);
    }
  };
  const handleBookUpdate = async () => {
    setBusy(true);
    try {
      const formData = new FormData();

      const { file, cover } = bookInfo;

      // Validate book file (must be epub type)
      if (file && file?.type !== "application/epub+zip") {
        return setErrors({
          ...errors,
          file: ["Please select a valid (.epub) file."],
        });
      } else {
        setErrors({
          ...errors,
          file: undefined,
        });
      }

      // Validate cover file
      if (cover && !cover.type.startsWith("image/")) {
        return setErrors({
          ...errors,
          cover: ["Please select a valid poster file."],
        });
      } else {
        setErrors({
          ...errors,
          cover: undefined,
        });
      }

      if (cover) {
        formData.append("cover", cover);
      }

      // validate data for book creation
      const bookToSend: BookToSubmit = {
        title: bookInfo.title,
        description: bookInfo.description,
        genre: bookInfo.genre,
        language: bookInfo.language,
        publicationName: bookInfo.publicationName,
        uploadMethod: "local",
        publishedAt: bookInfo.publishedAt,
        slug: initialState?.slug,
        price: {
          mrp: Number(bookInfo.mrp),
          sale: Number(bookInfo.sale),
        },
      };

      if (file) {
        bookToSend.fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }

      const result = updateBookSchema.safeParse(bookToSend);
      if (!result.success) {
        return setErrors(result.error.flatten().fieldErrors);
        // setErrors(result.error.flatten().fieldErrors);
      }

      if (file && result.data.uploadMethod === "local") {
        formData.append("book", file);
      }

      for (const key in bookToSend) {
        type keyType = keyof typeof bookToSend;
        const value = bookToSend[key as keyType];

        if (typeof value === "string") {
          formData.append(key, value);
        }

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        }
      }

      await onSubmit(formData);
      setCover("");
      toast.success("Congratulations!! Your changes have been published.", {
        position: "top-right",
        duration: 5000,
      });

      // console.log(result.data);
    } catch (error) {
      ParseError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    if (isForUpdate) handleBookUpdate();
    else handleBookPublish();
  };

  useEffect(() => {
    if (initialState) {
      const {
        title,
        description,
        language,
        genre,
        publicationName,
        publishedAt,
        price,
        cover,
      } = initialState;

      if (cover) setCover(cover);

      setBookInfo({
        title,
        description,
        language,
        genre,
        publicationName,
        publishedAt,
        mrp: price.mrp,
        sale: price.sale,
      });
    }

    setIsForUpdate(true);
  }, [initialState]);

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          {title}
        </h1>

        {/* File Upload Section */}
        <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
          <div className="space-y-3">
            <label 
              htmlFor="file" 
              className={clsx(
                "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl transition-colors",
                errors?.file 
                  ? "border-red-400 text-red-400" 
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400"
              )}
            >
              <span className="mb-2">Select EPUB File</span>
              <input
                accept="application/epub+zip"
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm opacity-70">Only .epub files are supported</span>
            </label>
            
            {/* Show selected file name */}
            {bookInfo.file && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">
                    📖
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {bookInfo.file.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {(bookInfo.file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}
            
            <ErrorList errors={errors?.file} />
          </div>

          <PosterSelector
            src={cover}
            name="cover"
            isInvalid={errors?.cover ? true : false}
            fileName={bookInfo.cover?.name}
            errorMessage={<ErrorList errors={errors?.cover} />}
            onChange={handleFileChange}
          />
        </div>

        {/* Book Details Section */}
        <div className="space-y-6">
          <Input
            type="text"
            name="title"
            isRequired
            label="Book Title"
            placeholder="Think & Grow Rich"
            value={bookInfo.title}
            onChange={handleTextChange}
            isInvalid={errors?.title ? true : false}
            errorMessage={<ErrorList errors={errors?.title} />}
            classNames={{
              label: "text-gray-600 dark:text-gray-400",
              input: "dark:text-gray-100"
            }}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Book Description
            </label>
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <RichEditor
                placeholder="About Book..."
                isInvalid={errors?.description ? true : false}
                errorMessage={<ErrorList errors={errors?.description} />}
                value={bookInfo.description}
                editable
                onChange={(description) => setBookInfo({ ...bookInfo, description })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              name="publicationName"
              type="text"
              label="Publication Name"
              isRequired
              placeholder="Penguin Book"
              value={bookInfo.publicationName}
              onChange={handleTextChange}
              isInvalid={errors?.publicationName ? true : false}
              errorMessage={<ErrorList errors={errors?.publicationName} />}
              classNames={{
                label: "text-gray-600 dark:text-gray-400",
                input: "dark:text-gray-100"
              }}
            />

            <DatePicker
              onChange={(date) => {
                setBookInfo({ ...bookInfo, publishedAt: date.toString() });
              }}
              value={bookInfo.publishedAt ? parseDate(bookInfo.publishedAt) : null}
              label="Publish Date"
              showMonthAndYearPickers
              isRequired
              isInvalid={errors?.publishedAt ? true : false}
              errorMessage={<ErrorList errors={errors?.publishedAt} />}
              classNames={{
                label: "text-gray-600 dark:text-gray-400"
              }}
            />

            <Autocomplete
              isRequired
              label="Language"
              placeholder="Select a Language"
              defaultSelectedKey={bookInfo.language}
              selectedKey={bookInfo.language}
              isInvalid={errors?.language ? true : false}
              errorMessage={<ErrorList errors={errors?.language} />}
              onSelectionChange={(key = "") => {
                setBookInfo({ ...bookInfo, language: key as string });
              }}
              classNames={{
                base: "dark:text-gray-400",
                listbox: "dark:bg-gray-800",
                popoverContent: "dark:bg-gray-800",
                endContentWrapper: "dark:text-gray-300",
                // value: "dark:text-gray-300",
                selectorButton: "dark:text-gray-300",
                clearButton: "dark:text-gray-300"
              }}
            >
              {languages.map((item) => (
                <AutocompleteItem 
                  key={item.name} 
                  value={item.name}
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Autocomplete
              isInvalid={errors?.genre ? true : false}
              errorMessage={<ErrorList errors={errors?.genre} />}
              label="Genre"
              placeholder="Select a Genre"
              defaultSelectedKey={bookInfo.genre}
              selectedKey={bookInfo.genre}
              onSelectionChange={(key = "") => {
                setBookInfo({ ...bookInfo, genre: key as string });
              }}
              isRequired
              classNames={{
                base: "dark:text-gray-400",
                listbox: "dark:bg-gray-800",
                popoverContent: "dark:bg-gray-800",
                endContentWrapper: "dark:text-gray-300",
                // value: "dark:text-gray-300",
                selectorButton: "dark:text-gray-300",
                clearButton: "dark:text-gray-300"
              }}
            >
              {genres.map((item) => (
                <AutocompleteItem 
                  key={item.name} 
                  value={item.name}
                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          {/* Price Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
            <p className={clsx(
              "text-sm font-medium mb-4",
              errors?.price ? "text-red-400" : "text-gray-600 dark:text-gray-400"
            )}>
              Price Information
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                name="mrp"
                type="number"
                label="MRP"
                isRequired
                placeholder="0.00"
                value={bookInfo.mrp}
                onChange={handleTextChange}
                isInvalid={errors?.price ? true : false}
                startContent={
                  <span className="text-default-400 text-small">$</span>
                }
                classNames={{
                  label: "text-gray-600 dark:text-gray-400",
                  input: "dark:text-gray-100"
                }}
              />
              <Input
                name="sale"
                type="number"
                label="Sale Price"
                isRequired
                placeholder="0.00"
                value={bookInfo.sale}
                onChange={handleTextChange}
                isInvalid={errors?.price ? true : false}
                startContent={
                  <span className="text-default-400 text-small">$</span>
                }
                classNames={{
                  label: "text-gray-600 dark:text-gray-400",
                  input: "dark:text-gray-100"
                }}
              />
            </div>
            <ErrorList errors={errors?.price} />
          </div>
        </div>

        <Button 
          isLoading={busy} 
          type="submit" 
          size="lg"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {submitBtnTitle}
        </Button>
      </form>
    </div>
  );
};

export default BookForm;
