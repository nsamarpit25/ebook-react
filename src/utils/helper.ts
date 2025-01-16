import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}

export const ParseError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError;
    if (data.errors) {
      // it is an array of objects with errors
      const messages = Object.values(data.errors).flat();

      return messages.map((message) => {
        return toast(message, { position: "top-right" });
      });
    }
    if (data.error) {
      // it is an single error message: string
      return toast(data.error, { position: "top-right" });
    }
  }
  if (error instanceof Error) {
    return toast(error.message, { position: "top-right" });
  }

  return toast("Something went wrong. Try again later.", {
    position: "top-right",
  });
};
