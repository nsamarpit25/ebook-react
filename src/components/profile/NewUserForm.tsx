import { Avatar, Button, Input } from "@nextui-org/react";
import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";

import { ParseError } from "../../utils/helper";

interface Props {
  name?: string;
  avatar?: string;
  onSubmit(data: FormData): Promise<void>;
  title: string;
  btnTitle: string;
}

type UserInfo = {
  name: string;
  avatar?: File;
};

const NewUserForm: FC<Props> = ({ name, avatar, onSubmit, title, btnTitle }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "" });
  const [localAvatar, setLocalAvatar] = useState("");
  const [invalidFormState, setInvalidFormState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);

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
      //   const { data } = await client.put("/auth/profile", formData);
      await onSubmit(formData);
    //   data.profile
    //   navigate("/");
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
          {title}
        </h1>
        <form className="w-full space-y-6 mt-6" onSubmit={handleSubmit}>
          <label
            htmlFor="avatar"
            className="cursor-pointer flex justify-center items-center"
          >
            <Avatar
              isBordered
              radius="sm"
              name="John"
              src={localAvatar || avatar}
            />
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
            value={userInfo.name || name}
            onChange={handleChange}
            isInvalid={invalidFormState}
            errorMessage={errorMessage}
          />

          <Button type="submit" className="w-full" isLoading={busy}>
            {btnTitle}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewUserForm;
