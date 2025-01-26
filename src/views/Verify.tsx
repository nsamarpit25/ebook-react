import { FC } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { updateProfile } from "../store/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Cookies from "js-cookie";

const Verify: FC = () => {
  const [searchParams] = useSearchParams();
  const profileInfoString = searchParams.get("profile");
  const authToken = searchParams.get("authToken");

  // console.log(authToken);
  const dispatch = useDispatch();

  if (authToken) {
    Cookies.set("authToken", authToken || "", {
      expires: 7, // Expiry in days
      path: "/", // Make it available for all paths
      secure: true, // Ensure it's sent only over HTTPS
      sameSite: "None", // Allow cross-site requests
    });
  }
  if (profileInfoString) {
    try {
      const profile = JSON.parse(profileInfoString);
      console.log(profile);
      if (!profile.signedUp) {
        return <Navigate to={"/new-user"} />;
      }

      dispatch(updateProfile(profile));

      return <Navigate to="/" />;
    } catch (_err) {
      return <Navigate to={"/not-found"} />;
    }
  }
  return <LoadingSpinner />;
};

export default Verify;
