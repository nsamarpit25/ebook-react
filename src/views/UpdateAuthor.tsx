import { FC, useEffect, useState } from "react";
import AuthorForm, {
  AuthorInfo,
  InitialState,
} from "../components/common/AuthorForm";
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

  if (busy)
    return (
      <div className="min-h-screen  p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br  p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
              Update Author Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
              Modify your author information and preferences
            </p>
          </div>

          <AuthorForm
            btnTitle="Update Profile"
            initialState={authorInfo}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateAuthor;
