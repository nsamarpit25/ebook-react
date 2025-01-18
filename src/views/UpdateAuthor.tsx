import { FC, useEffect, useState } from "react";
import AuthorForm, { AuthorInfo, InitialState } from "../components/common/AuthorForm";
import useAuth from "../hooks/useAuth";
import client from "../api/client";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

interface Props {}

const UpdateAuthor: FC<Props> = () => {
  const { profile } = useAuth();
  const [busy, setBusy] = useState(true);
  const [authorInfo, setAuthorInfo] = useState<InitialState>();

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      try {
        const { data } = await client.get(`/author/${profile?.authorId}`);
        // console.log("data: ", data);
        setAuthorInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setBusy(false);
      }
    };
    fetchAuthorInfo();
    // console.log(authorInfo)
  }, [profile?.authorId]);

  const handleSubmit = async (data: AuthorInfo) => {
    const res = await client.patch("/author", data);
    // console.log(res.data)
    if (res.data) {
      toast.success(res.data.message);
    }
  };

  if (busy) return <LoadingSpinner />;

  return <AuthorForm btnTitle="Update Profile" initialState={authorInfo} onSubmit={handleSubmit}/>;
};

export default UpdateAuthor;
