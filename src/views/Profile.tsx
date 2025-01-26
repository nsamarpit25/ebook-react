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
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-8 relative group">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-danger/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative">
            {/* Avatar with gradient ring */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-danger rounded-lg opacity-0 group-hover:opacity-25 blur-sm transition-opacity duration-300" />
              <Avatar
                src={profile?.avatar}
                className="w-20 h-20 sm:w-24 sm:h-24"
                radius="lg"
                name={profile?.name}
                showFallback
                classNames={{
                  base: "border-2 border-content2 relative",
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                {profile.name}
              </h2>
              <p className="text-sm sm:text-base text-foreground-500 mt-1">
                {profile.email}
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between">
                <div className="bg-content2/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-foreground-500 mr-2">Role:</span>
                  <span className="font-semibold text-foreground">
                    {profile.role.toUpperCase()}
                  </span>
                </div>

                {profile.role === "user" ? (
                  <Link
                    className="text-primary hover:text-danger font-medium transition-colors text-sm sm:text-base"
                    to="/author-registration"
                  >
                    Become an Author
                  </Link>
                ) : (
                  <Link
                    className="text-primary hover:text-danger font-medium transition-colors text-sm sm:text-base"
                    to="/update-author"
                  >
                    Update Author Profile
                  </Link>
                )}
              </div>
            </div>

            <Button
              className="fixed sm:absolute right-6 top-6 sm:right-4 sm:top-4 z-10
                bg-content2/50 backdrop-blur-sm hover:bg-content3/50 transition-colors"
              radius="full"
              isIconOnly
              onClick={() => navigate("/update-profile")}
            >
              <BsPencilSquare className="text-foreground-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
