import { Button, Spinner } from "@nextui-org/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProfileMenu from "./ProfileMenu";

const ProfileOptions: FC = () => {
  const { profile, status, signOut } = useAuth();

  if (status === "busy")
    return (
      <div className="relative w-10 h-10 rounded-full bg-default-100/50 backdrop-blur-lg flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300" />
        <Spinner size="sm" color="primary" className="relative z-10" />
      </div>
    );

  if (!profile)
    return (
      <Button
        as={Link}
        to="sign-up"
        radius="full"
        className="bg-gradient-to-r from-primary to-danger text-white shadow-lg
        hover:shadow-danger/25 hover:scale-105 font-medium
        transition-all duration-300 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10">Sign In</span>
      </Button>
    );

  return <ProfileMenu profile={profile} signOut={signOut} />;
};

export default ProfileOptions;
