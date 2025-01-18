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
    <div className="flex-1 flex flex-col items-center ">
      <div className="flex min-w-96 bg-slate-100 p-4 rounded-lg">
        <Avatar
          src={profile?.avatar}
          className="w-20 h-20"
          radius="sm"
          name={profile?.name}
        />

        <div className="flex-1 pl-4 ">
          <p className="text-xl font-semibold">{profile.name}</p>
          <p>{profile.email}</p>

          <div className="flex justify-between items-center mt-2">
            <p>
              Role:{" "}
              <span className="font-semibold text-sm">
                {profile.role.toUpperCase()}
              </span>
            </p>
            {profile.role === "user" ? (
              <Link className="text-xs underline" to="/author-registration">
                Become an Author
              </Link>
            ) : (
              <Link className="text-xs underline" to="/update-author">
                Update Profile
              </Link>
            )}
          </div>
        </div>

        <Button
          className="ml-auto"
          variant="flat"
          isIconOnly
          onClick={() => navigate("/update-profile")}
        >
          <BsPencilSquare size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
