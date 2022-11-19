import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const Profile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div
      className="rounded-full py-2 px-3 flex bg-slate-500 gap-2 items-center"
      onClick={handleSignOut}
    >
      <img
        src={auth.profile_picture}
        className="rounded-full h-5 aspect-square object-contain"
      />
      <p className="text-white text-sm">{auth.username}</p>
    </div>
  );
};

export default Profile;
