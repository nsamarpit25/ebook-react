import { FC } from "react";
import client from "../api/client";
import NewUserForm from "../components/profile/NewUserForm";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";
import { useNavigate } from "react-router-dom";

interface Props {}

const UpdateProfile: FC<Props> = () => {
    const {profile} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    const {data} = await client.put("/auth/profile", formData);
    dispatch(updateProfile(data.profile));
    navigate('/profile')
  };

  return <NewUserForm onSubmit={handleSubmit} name={profile?.name} avatar={profile?.avatar} title="Update Profile" btnTitle="Update Profile"></NewUserForm>;
};

export default UpdateProfile;
