import { Spinner } from "@nextui-org/react";
import { FC } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

interface Props {}

const Verify: FC<Props> = () => {
  const [searchParams] = useSearchParams();
  const profileInfoString = searchParams.get("profile");
  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);
      if (!profile.signedUp) {
        return <Navigate to={"/new-user"} />;
      }

      return <Navigate to="/" />;
    } catch (error) {
      return <Navigate to={"/not-found"} />;
    }
  }
  return (
    <div className="flex justify-center items-center p-10">
      <Spinner label="Verifying...." color="warning" />
    </div>
  );
};

export default Verify;
