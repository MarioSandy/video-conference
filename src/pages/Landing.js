import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <p className="text-4xl font-bold mb-10">
          Try Our Web Conference App Now
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              navigate("register");
            }}
          >
            Join Us
          </Button>
          <Button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
