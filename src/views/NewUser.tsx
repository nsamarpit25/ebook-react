import { FC } from "react";
import client from "../api/client";
import NewUserForm from "../components/profile/NewUserForm";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";
import useAuth from "../hooks/useAuth";

interface Props {}

const NewUser: FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    try {
      const { data } = await client.put("/auth/profile", formData);
      dispatch(updateProfile(data.profile));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (profile?.signedUp) return <Navigate to="/" />;

  return (
    <div className=" bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg relative group overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                You're almost there!
              </h1>
              <p className="text-foreground/80">
                Complete your profile to get started
              </p>
            </div>

            <NewUserForm
              onSubmit={handleSubmit}
              title="Complete Your Profile"
              btnTitle="Complete Setup"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
