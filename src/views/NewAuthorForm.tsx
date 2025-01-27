import { FC } from "react";
import AuthorForm, { AuthorInfo } from "../components/common/AuthorForm";
import client from "../api/client";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";

interface Props {}

const NewAuthorRegistration: FC<Props> = () => {
  const { profile } = useAuth();
  const isAuthor = profile?.role === "author";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (data: AuthorInfo) => {
    const res = await client.post("/author/register", data);
    if (res.data) {
      dispatch(updateProfile(res.data.user));
      toast.success(res.data.message);
    }
    navigate("/profile");
  };

  if (isAuthor) {
    navigate("/profile");
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg relative group overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 sm:p-8">
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                Become an Author
              </h1>
              <p className="text-foreground/80">
                Share your stories with the world
              </p>
            </div>

            <AuthorForm onSubmit={handleSubmit} btnTitle="Register as Author" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAuthorRegistration;
