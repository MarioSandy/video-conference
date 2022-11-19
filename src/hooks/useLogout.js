import { api } from "../api/api";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
  return logout;
};

export default useLogout;
