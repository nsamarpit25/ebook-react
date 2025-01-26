import { FC } from "react";
import client from "../api/client";
import NewUserForm from "../components/profile/NewUserForm";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";
import { useNavigate } from "react-router-dom";

interface Props {}

const UpdateProfile: FC<Props> = () => {
  const { profile } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    const { data } = await client.put("/auth/profile", formData);
    dispatch(updateProfile(data.profile));
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg relative group">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-danger/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative p-6">
            <NewUserForm
              onSubmit={handleSubmit}
              name={profile?.name}
              avatar={profile?.avatar}
              title="Update Profile"
              btnTitle="Update Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
