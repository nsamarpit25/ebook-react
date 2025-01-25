import { FC } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { updateProfile } from "../store/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Verify: FC = () => {
  const [searchParams] = useSearchParams();
  const profileInfoString = searchParams.get("profile");
  const dispatch = useDispatch();

  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);
      if (!profile.signedUp) {
        return <Navigate to={"/new-user"} />;
      }

      dispatch(updateProfile(profile));

      return <Navigate to="/" />;
    } catch (err) {
      // console.log(err)
      return <Navigate to={"/not-found"} />;
    }
  }
  return <LoadingSpinner />;
};

export default Verify;
