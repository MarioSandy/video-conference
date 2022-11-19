import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PassportCallback = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams !== undefined) {
      setAuth({
        user_id: searchParams.get("user_id"),
        username: searchParams.get("username"),
        email: searchParams.get("email"),
        profile_picture: searchParams.get("profile_picture"),
      });
    }
  }, [searchParams]);

  useEffect(() => {
    navigate("/");
  }, [auth]);
};

export default PassportCallback;
