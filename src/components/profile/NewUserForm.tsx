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

const NewUserForm: FC<Props> = ({
  name,
  avatar,
  onSubmit,
  title,
  btnTitle,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: name || "" });
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
    <div className=" flex justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-8 border border-default-200/50">
        <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
          {title}
        </h1>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <label htmlFor="avatar" className="cursor-pointer relative group">
              <Avatar
                isBordered
                radius="lg"
                size="lg"
                name={name || "User"}
                src={localAvatar || avatar}
                className="w-24 h-24 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                classNames={{
                  base: "border-2 border-default-200/50 shadow-md",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-danger/60 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
              <input
                accept="image/*"
                type="file"
                name="avatar"
                id="avatar"
                hidden
                onChange={handleChange}
              />
            </label>
          </div>

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
            classNames={{
              input: "backdrop-blur-sm",
              inputWrapper:
                "backdrop-blur-sm bg-content1/20 hover:bg-content1/30 transition-all duration-300",
              label: "text-foreground/80",
              errorMessage: "text-danger font-medium",
            }}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-danger text-white shadow-lg hover:opacity-90 transition-all duration-300"
            size="lg"
            radius="lg"
            isLoading={busy}
          >
            {btnTitle}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewUserForm;
