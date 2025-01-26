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
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg p-8 relative group">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-danger/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                Update Author Profile
              </h1>
              <p className="text-foreground-500 mt-2">
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
    </div>
  );
};

export default UpdateAuthor;
