import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { Avatar, Button } from "@nextui-org/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

interface Props {}

const Profile: FC<Props> = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) return <Navigate to="/sign-up" />;

  return (
    <div className="min-h-screen bg-gradient-to-br  p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-start gap-6">
            <Avatar
              src={profile?.avatar}
              className="w-24 h-24"
              radius="lg"
              name={profile?.name}
              showFallback
              classNames={{
                base: "border-2 border-gray-200 dark:border-gray-700",
              }}
            />

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {profile.email}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                  <span className="text-gray-600 dark:text-gray-400 mr-2">Role:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">
                    {profile.role.toUpperCase()}
                  </span>
                </div>

                {profile.role === "user" ? (
                  <Link 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    to="/author-registration"
                  >
                    Become an Author
                  </Link>
                ) : (
                  <Link 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    to="/update-author"
                  >
                    Update Author Profile
                  </Link>
                )}
              </div>
            </div>

            <Button
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              radius="full"
              isIconOnly
              onClick={() => navigate("/update-profile")}
            >
              <BsPencilSquare className="text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
