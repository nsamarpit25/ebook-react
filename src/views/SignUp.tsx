import { Button, Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import { RiMailCheckLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import client from "../api/client";
import Book from "../svg/Book";

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
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-danger rounded-full opacity-25 blur-xl animate-pulse" />
          <RiMailCheckLine
            size={80}
            className="animate-bounce text-primary relative"
          />
        </div>

        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-4 text-center">
          Please check your email for the magic link
        </h2>

        {/* Development Preview Box */}
        <div className="w-full mt-8 bg-content1/50 backdrop-blur-lg rounded-2xl p-6 border border-content2">
          <div className="flex items-center mb-3">
            <span className="bg-warning rounded-full w-2 h-2 mr-2"></span>
            <p className="text-sm font-medium text-foreground-500">
              Development Preview
            </p>
          </div>

          <p className="text-sm text-foreground-500 mb-4">
            For demo purposes, use the authentication link below:
          </p>

          <div className="group relative">
            <Link
              to={link}
              className="flex items-center justify-center gap-2 w-full p-4
                bg-gradient-to-r from-primary to-danger text-white rounded-xl
                shadow-lg hover:shadow-primary/25 hover:opacity-90
                transition-all duration-300 font-medium"
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
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center w-96 bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg p-8 relative group">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-danger/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <Book className="w-44 h-44 mb-6" />
          <h1 className="text-center text-xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-6">
            Books are the keys to countless doors. Sign up and unlock your
            potential.
          </h1>

          {/* Demo Message */}
          <div className="w-full mb-6 p-4 bg-content2/50 backdrop-blur-sm rounded-xl border border-content3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
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
                <p className="text-sm font-medium text-foreground">
                  Demo Mode Active
                </p>
                <p className="text-xs text-foreground-500">
                  Enter any email address to receive an instant magic link here
                  for testing purposes.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <Input
              label="Email"
              placeholder="john@email.com"
              variant="bordered"
              isInvalid={invalidForm}
              errorMessage="Invalid email!"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              classNames={{
                input: "bg-content2/50 backdrop-blur-sm",
                inputWrapper:
                  "bg-content2/50 backdrop-blur-sm hover:bg-content2/70 transition-colors",
              }}
            />
            <Button
              isLoading={busy}
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-danger text-white shadow-lg
                hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
            >
              Send Me The Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
