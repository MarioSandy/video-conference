import { api } from "../api/api";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refreshToken = async () => {
    const response = await api.get("/auth/refresh-token", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return {
        ...prev,
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        profile_picture: response.data.profile_picture,
        access_token: response.data.access_token,
      };
    });
    return response.data.access_token;
  };
  return refreshToken;
};

export default useRefreshToken;
