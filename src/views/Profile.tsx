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
    <div className="min-h-screen bg-gradient-to-br p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative">
            <Avatar
              src={profile?.avatar}
              className="w-20 h-20 sm:w-24 sm:h-24"
              radius="lg"
              name={profile?.name}
              showFallback
              classNames={{
                base: "border-2 border-gray-200 dark:border-gray-700",
              }}
            />

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                {profile.email}
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base">
                  <span className="text-gray-600 dark:text-gray-400 mr-2">
                    Role:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">
                    {profile.role.toUpperCase()}
                  </span>
                </div>

                {profile.role === "user" ? (
                  <Link
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm sm:text-base"
                    to="/author-registration"
                  >
                    Become an Author
                  </Link>
                ) : (
                  <Link
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm sm:text-base"
                    to="/update-author"
                  >
                    Update Author Profile
                  </Link>
                )}
              </div>
            </div>

            <Button
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors fixed sm:absolute right-6 top-6 sm:right-0 sm:top-0 z-10"
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
