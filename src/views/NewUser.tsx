import { FC } from "react";
import client from "../api/client";
import NewUserForm from "../components/profile/NewUserForm";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";

interface Props {}

const NewUser: FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formData: FormData) => {
    const { data } = await client.put("/auth/profile", formData);
    dispatch(updateProfile(data.profile));
    navigate("/");
  };

  return (
    <NewUserForm
      onSubmit={handleSubmit}
      title="You are almost there, Please fill out the form below"
      btnTitle="Sign Me Up"
    ></NewUserForm>
  );
};

export default NewUser;
