import { Button, Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import Book from "../svg/Book";
import client from "../api/client";
import { RiMailCheckLine } from "react-icons/ri";

interface Props {}

const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
);

const SignUp: FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();

    if (!emailRegex.test(email)) return setInvalidForm(true);

    setInvalidForm(false);

    setBusy(true);
    try {
      await client.post("/auth/generate-link", {
        email,
      });

      setShowSuccessResponse(true);
    } catch (error) {
      console.log(error);
    } finally {
      setBusy(false);
    }
  };

  if (showSuccessResponse)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <RiMailCheckLine size={80} className="animate-bounce text-blue-500 dark:text-blue-400" />
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Please check your email we just sent you a magic link.
        </p>
      </div>
    );

  return (
    <div className="flex-1 flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center w-96 border-2 dark:border-gray-700 p-5 rounded-md bg-white dark:bg-gray-800">
        <Book className="w-44 h-44 text-blue-500 dark:text-blue-400" />
        <h1 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
          Books are the keys to countless doors. Sign up and unlock your potential.
        </h1>

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
