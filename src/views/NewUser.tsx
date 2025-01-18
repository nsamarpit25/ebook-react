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
  const {profile} = useAuth();

  const handleSubmit = async (formData: FormData) => {
    try {
      const { data } = await client.put("/auth/profile", formData);
      dispatch(updateProfile(data.profile));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if(profile?.signedUp) return <Navigate to="/" />

  return (
    <NewUserForm
      onSubmit={handleSubmit}
      title="You are almost there, Please fill out the form below"
      btnTitle="Sign Me Up"
    ></NewUserForm>
  );
};

export default NewUser;
