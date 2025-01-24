import { Button, Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import Book from "../svg/Book";
import client from "../api/client";
import { RiMailCheckLine } from "react-icons/ri";
import { Link } from "react-router-dom";

interface Props {}

const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
);

const SignUp: FC<Props> = () => {
  const [email, setEmail] = useState("kakashi@naruto.com");
  const [busy, setBusy] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);

  // for development....
  const [link, setLink] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();

    if (!emailRegex.test(email)) return setInvalidForm(true);

    setInvalidForm(false);

    setBusy(true);
    try {
      const { data } = await client.post("/auth/generate-link", {
        email,
      });
      // console.log(data);
      setLink(data.link);

      setShowSuccessResponse(true);
    } catch (error) {
      console.log(error);
    } finally {
      setBusy(false);
    }
  };

  if (showSuccessResponse)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto">
        <RiMailCheckLine
          size={80}
          className="animate-bounce text-blue-500 dark:text-blue-400 mb-6"
        />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          Please check your email for the magic link
        </h2>

        {/* Development Preview Box */}
        <div className="w-full mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <span className="bg-yellow-500 rounded-full w-2 h-2 mr-2"></span>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Development Preview
            </p>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            For demo purposes, use the authentication link below:
          </p>

          <div className="group relative">
            <Link
              to={link}
              className="flex items-center justify-center gap-2 w-full p-4
               bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
               rounded-lg border border-transparent hover:border-blue-400
               transition-all duration-300 ease-in-out transform hover:-translate-y-0.5
               text-white font-medium tracking-wide text-sm"
            >
              <span>Verify Email</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center w-96 border-2 dark:border-gray-700 p-5 rounded-md bg-white dark:bg-gray-800">
        <Book className="w-44 h-44 text-blue-500 dark:text-blue-400" />
        <h1 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
          Books are the keys to countless doors. Sign up and unlock your
          potential.
        </h1>

        {/* Demo Message */}
        <div className="w-full mt-4 mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Demo Mode Active
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Enter any email address to receive an instant magic link here
                for testing purposes.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
          <Input
            label="Email"
            placeholder="john@email.com"
            variant="bordered"
            isInvalid={invalidForm}
            errorMessage="Invalid email!"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            classNames={{
              input: "dark:text-white",
              label: "dark:text-gray-300",
            }}
          />
          <Button
            isLoading={busy}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Send Me The Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
