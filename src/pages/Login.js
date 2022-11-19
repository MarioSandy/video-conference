import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import googleIcon from "../assets/img/google.png";
import { api } from "../api/api";
import InputPassword from "../components/InputPassword";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth, persist, setPersist } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [error, setError] = useState({
    email: {
      required: true,
      email: true,
      not_found: false,
    },
    password: {
      required: true,
      not_found: false,
    },
  });

  const onChangeForm = (value, field, required) => {
    let isRequiredValid = true;
    let errorFields = error[field];
    if (errorFields.not_found) errorFields.not_found = false;

    setForm((prev) => {
      const fields = {
        ...prev,
        [field]: value,
      };
      return fields;
    });

    if (required) {
      if (value.length < 1) {
        errorFields.required = true;
        onError(errorFields, `${field}`);
        isRequiredValid = false;
      } else {
        errorFields.required = false;
      }
    }

    if (isRequiredValid) {
      switch (field) {
        case "email": {
          errorFields["email"] = !String(value)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
          break;
        }
      }
      onError(errorFields, `${field}`);
    }
  };

  const onTouched = (value, field) => {
    setTouched((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const onError = (value, field) => {
    setError((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const googleLogin = () => {
    window.open("http://127.0.0.1:5000/auth/google", "_self");
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  const submitLogin = () => {
    setLoading(true);
    api
      .post("/auth/login", form, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        setAuth({
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          profile_picture: data.profile_picture,
          access_token: data.access_token,
        });
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally((fin) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  useEffect(() => {
    let isValid = true;
    Object.entries(error).forEach(([key, values]) => {
      if (isValid) {
        isValid = !Object.entries(values).some(([keyValue, value]) => value);
      }
    });
    setIsFormValid(isValid);
  }, [error]);
  return (
    <div className="bg-sky-400 flex items-center justify-center h-screen">
      <div className="bg-white divide-y px-6 pt-6 pb-6  w-[450px] rounded-lg shadow-xl">
        <div>
          <p className="text-gray-400 text-2xl text-center font-semibold py-2">
            LOGIN
          </p>
          <div className="mb-2">
            <p className="font-medium mb-2">
              Email <span className="text-danger text-[#eb0e14]"> * </span>
            </p>
            <Input
              onChange={(value) => onChangeForm(value, "email", true)}
              error={
                touched.email &&
                (error.email.required ||
                  error.email.email ||
                  error.email.not_found)
              }
              touched={(value) => onTouched(value, "email")}
            />
            {!touched.email ? null : error.email.required ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                Email is required!
              </p>
            ) : error.email.email ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                Format email is incorrect!
              </p>
            ) : error.email.not_found ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                Email or password is incorrect!
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <p className="font-medium mb-2">
              Password <span className="text-danger text-[#eb0e14]"> * </span>
            </p>
            <InputPassword
              onChange={(value) => onChangeForm(value, "password", true)}
              error={
                touched.password &&
                (error.password.required || error.password.not_found)
              }
              touched={(value) => onTouched(value, "password")}
            />
            {!touched.password ? null : error.password.required ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                Password harus diisi!
              </p>
            ) : error.password.not_found ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                Email atau password salah!
              </p>
            ) : null}
          </div>
          <div className="flex">
            <Checkbox
              label="Remember me"
              value={persist}
              checked={persist}
              onChange={togglePersist}
            />
            <Link to="/forget-password" className="ml-auto">
              <p className="text-purple-700 text-sm text-sky-400">
                Forget password?
              </p>
            </Link>
          </div>
          <div className="flex justify-center gap-5 py-6">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                googleLogin();
              }}
            >
              <img src={googleIcon} className="h-[1em]" />
              <p className="text-xs text-gray-600">Login with Google</p>
            </div>
          </div>
          <div className="mb-4">
            <Button
              block={true}
              loading={loading}
              disabled={!isFormValid}
              onClick={submitLogin}
            >
              Login
            </Button>
          </div>
          <div
            className="flex justify-end mb-2 cursor-pointer"
            onClick={() => {
              navigate("/register");
            }}
          >
            <p className="text-xs text-gray-400 font-semibold">
              Not yet join ? Register now !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
