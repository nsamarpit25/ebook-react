import { Avatar, Button, Input } from "@nextui-org/react";
import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import { useNavigate } from "react-router-dom";

interface Props {}

type UserInfo = {
  name: string;
  avatar?: File;
};

const NewUser: FC<Props> = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "" });
  const [localAvatar, setLocalAvatar] = useState("");
  const [invalidFormState, setInvalidFormState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, files } = e.target;

    if (name === "name") {
      setUserInfo((old) => ({ ...old, name: value }));
    }
    if (name === "avatar" && files) {
      const file = files[0];
      setUserInfo((old) => ({ ...old, avatar: file }));
      setLocalAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (userInfo.name.trim().length < 3) {
      setErrorMessage("Name must be three characters long!");
      return setInvalidFormState(true);
    } else {
      setErrorMessage("");
      setInvalidFormState(false);
    }

    formData.append("name", userInfo.name);

    if (userInfo.avatar?.type.startsWith("image")) {
      formData.append("avatar", userInfo.avatar);
    }
    setBusy(true);
    try {
      const { data } = await client.put("/auth/profile", formData);
      navigate("/");
    } catch (error) {
      ParseError(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="w-96 border-2 p-5 rounded-md flex flex-col justify-center items-center ">
        <h1 className="text-center text-xl font-semibold">
          You are almost there, Please fill out the form below
        </h1>
        <form className="w-full space-y-6 mt-6" onSubmit={handleSubmit}>
          <label
            htmlFor="avatar"
            className="cursor-pointer flex justify-center items-center"
          >
            <Avatar isBordered radius="sm" name="John" src={localAvatar} />
            <input
              accept="image/*"
              type="file"
              name="avatar"
              id="avatar"
              hidden
              onChange={handleChange}
            />
          </label>
          <Input
            name="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            variant="bordered"
            value={userInfo.name}
            onChange={handleChange}
            isInvalid={invalidFormState}
            errorMessage={errorMessage}
          />

          <Button type="submit" className="w-full" isLoading={busy}>
            Sign Me Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
