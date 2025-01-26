import { FC, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import RichEditor from "../rich-editor";
import { Button, Input } from "@nextui-org/react";
import { MdClose, MdOutlineAdd } from "react-icons/md";
import { z } from "zod";
import ErrorList from "./ErrorList";
import { ParseError } from "../../utils/helper";

export interface AuthorInfo {
  name: string;
  about: string;
  socialLinks?: string[];
}

export interface InitialState extends AuthorInfo {
  id: string;
}

interface Props {
  btnTitle?: string;
  onSubmit(data: AuthorInfo): Promise<void>;
  initialState?: InitialState;
}

const newAuthorSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .trim()
    .min(3, "Invalid name"),
  about: z
    .string({
      required_error: "About is missing!",
      invalid_type_error: "Invalid about!",
    })
    .trim()
    .min(100, "Please write at least 100 characters about yourself!"),
  socialLinks: z
    .array(z.string().url("Social links can only be list of valid URLs!"))
    .optional(),
});

const AuthorForm: FC<Props> = ({ initialState, btnTitle, onSubmit }) => {
  const [socialLinks, setSocialLinks] = useState([""]);
  const [about, setAbout] = useState(
    "For Demo: I am a passionate writer and storyteller with over a decade of experience in creating compelling narratives. My work spans multiple genres including fiction, non-fiction, and technical writing. I believe in the power of words to inspire, educate, and transform lives. Through my books, I aim to share unique perspectives and connect with readers on a deeper level."
  );
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  // const [isAuthor, setIsAuthor] = useState(false);

  const { profile } = useAuth();

  const addLinkFields = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const removeLinkField = (index: number) => {
    const oldList = [...socialLinks];
    oldList.splice(index, 1);

    setSocialLinks(oldList);
  };

  const updateSocialLinks = (index: number, value: string) => {
    const oldList = [...socialLinks];
    oldList[index] = value;
    setSocialLinks(oldList);
  };

  const handleSubmit = async () => {
    try {
      setBusy(true);
      const links: string[] = [];

      socialLinks.forEach((link) => {
        if (link.trim()) links.push(link);
      });

      const data = {
        name: profile?.name,
        about,
        socialLinks: links,
      };

      const result = newAuthorSchema.safeParse(data);
      setErrors(undefined);
      if (!result.success) {
        return setErrors(result.error.flatten().fieldErrors);
      }

      await onSubmit(result.data);
      // console.log("result: ", result.data);
    } catch (error) {
      ParseError(error);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (initialState) {
      setAbout(initialState.about);
      let links = [""];

      if (initialState.socialLinks?.length) {
        links = initialState.socialLinks;
      }

      setSocialLinks(links);
    }
  }, [initialState]);

  return (
    <div className="space-y-8">
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-danger/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
        <p className="relative p-4 bg-content2/50 backdrop-blur-sm rounded-xl">
          Name:{" "}
          <span className="font-semibold text-lg bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
            {profile?.name}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <RichEditor
          onChange={(value) => {
            setAbout(value);
            if (about.length > 100) {
              setErrors({ ...errors, about: undefined });
            }
          }}
          value={about}
          editable
          placeholder="About yourself..."
          isInvalid={errors?.about ? true : false}
          errorMessage={<ErrorList errors={errors?.about} />}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground-600">
          Social Links:
        </p>

        <ErrorList errors={errors?.socialLinks} />

        {socialLinks.map((_, index) => {
          return (
            <div key={index} className="flex items-center gap-4">
              <Input
                onChange={({ target }) =>
                  updateSocialLinks(index, target.value)
                }
                value={socialLinks[index]}
                placeholder="eg: https://github.com/username"
                classNames={{
                  input: "bg-content2/50 backdrop-blur-sm",
                  inputWrapper:
                    "bg-content2/50 backdrop-blur-sm hover:bg-content2/70 transition-colors",
                }}
              />
              {socialLinks.length > 1 && (
                <Button
                  isIconOnly
                  size="sm"
                  onClick={() => removeLinkField(index)}
                  className="bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                >
                  <MdClose />
                </Button>
              )}
            </div>
          );
        })}

        <div className="flex justify-end">
          <Button
            isIconOnly
            size="sm"
            onClick={addLinkFields}
            className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <MdOutlineAdd />
          </Button>
        </div>
      </div>

      <Button
        isLoading={busy}
        onClick={handleSubmit}
        size="lg"
        className="w-full bg-gradient-to-r from-primary to-danger text-white shadow-lg
          hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
      >
        {btnTitle}
      </Button>
    </div>
  );
};

export default AuthorForm;
