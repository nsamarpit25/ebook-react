import { Avatar, Button } from "@nextui-org/react";
import { FC } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthorPublicationTable from "../components/AuthorPublicationTable";
import useAuth from "../hooks/useAuth";

interface Props {}

const Profile: FC<Props> = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) return <Navigate to="/sign-up" />;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-xl border border-divider">
          <div className="h-32 bg-gradient-to-r from-primary/10 to-danger/10" />

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:-mt-16">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-danger blur-md opacity-50" />
                  <Avatar
                    src={profile?.avatar}
                    className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-background relative"
                    radius="lg"
                    name={profile?.name}
                    showFallback
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  <p className="text-foreground-500">{profile?.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full border border-divider">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {profile?.role}
                    </span>
                  </div>

                  {profile?.role === "user" ? (
                    <Link
                      className="text-primary hover:text-danger transition-colors text-sm font-medium"
                      to="/author-registration"
                    >
                      Become an Author
                    </Link>
                  ) : (
                    <Link
                      className="text-primary hover:text-danger transition-colors text-sm font-medium"
                      to="/update-author"
                    >
                      Update Author Profile
                    </Link>
                  )}
                </div>
              </div>

              <Button
                className="absolute top-4 right-4"
                isIconOnly
                variant="light"
                onClick={() => navigate("/update-profile")}
              >
                <BsPencilSquare className="text-xl" />
              </Button>
            </div>
          </div>
        </div>

        {/* Books Section */}
        {profile.authorId && <AuthorPublicationTable />}
      </div>
    </div>
  );
};

export default Profile;
