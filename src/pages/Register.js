import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import googleIcon from "../assets/img/google.png";
import facebookIcon from "../assets/img/facebook.png";
import { api } from "../api/api";
import InputPassword from "../components/InputPassword";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
  });
  const [error, setError] = useState({
    email: {
      required: true,
      email: true,
    },
    username: {
      required: true,
    },
    password: {
      required: true,
      min_6: true,
      different: true,
    },
    confirm_password: {
      required: true,
      min_6: true,
      different: true,
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

    if (isRequiredValid)
      switch (field) {
        case "email": {
          errorFields["email"] = !String(value)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
          break;
        }
        case "password": {
          const different = value !== form.confirm_password;
          const min6 = value.length < 6;
          setError((prev) => {
            return {
              ...prev,
              password: {
                ...prev.password,
                different,
                min_6: min6,
              },
              confirm_password: {
                ...prev.confirm_password,
                different,
              },
            };
          });
          break;
        }
        case "confirm_password": {
          const different = value !== form.password;
          const min6 = value.length < 6;
          setError((prev) => {
            return {
              ...prev,
              password: {
                ...prev.password,
                different,
              },
              confirm_password: {
                ...prev.confirm_password,
                different,
                min_6: min6,
              },
            };
          });
          break;
        }
      }
    if (!(field === "password" || field === "confirm_password")) {
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

  const submitLogin = () => {
    setLoading(true);
    api
      .post("/auth/register", form)
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally((fin) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log(error);
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
            REGISTER
          </p>
          <div className="mb-2">
            <p className="font-medium mb-2">
              Username <span className="text-danger text-[#eb0e14]"> * </span>
            </p>
            <Input
              onChange={(value) => onChangeForm(value, "username", true)}
              error={
                touched.username &&
                (error.username.required || error.username.not_found)
              }
              touched={(value) => onTouched(value, "username")}
            />
            {!touched.username ? null : error.username.required ? (
              <p className="text-danger text-[#eb0e14] text-sm">
                Username is required!
              </p>
            ) : error.password.not_found ? (
              <p className="text-danger text-[#eb0e14] text-sm">!</p>
            ) : null}
          </div>
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
          <div className="mb-2">
            <p className="font-medium mb-2 text-left">
              Password
              <span className="text-danger text-[#eb0e14]"> * </span>
            </p>
            <InputPassword
              onChange={(value) => onChangeForm(value, "password", true)}
              error={
                touched.password &&
                (error.password.required ||
                  error.password.min_6 ||
                  error.password.different ||
                  error.password.not_found)
              }
              touched={(value) => onTouched(value, "password")}
            />
            {!touched.password ? null : error.password.required ? (
              <p className="text-danger text-[#eb0e14] text-sm text-left">
                Password is required!
              </p>
            ) : error.password.min_6 ? (
              <p className="text-danger text-[#eb0e14] text-sm text-left">
                Password should be at least 6 character!
              </p>
            ) : error.password.different ? (
              <p className="text-danger text-[#eb0e14] text-sm text-left">
                Password and confirm password doesn't matched!
              </p>
            ) : null}
          </div>
          <div>
            <p className="font-medium mb-2 text-left">
              Confirm Password
              <span className="text-danger text-[#eb0e14]"> * </span>
            </p>
            <InputPassword
              onChange={(value) =>
                onChangeForm(value, "confirm_password", true)
              }
              error={
                touched.confirm_password &&
                (error.confirm_password.required ||
                  error.confirm_password.min_6 ||
                  error.confirm_password.different)
              }
              touched={(value) => onTouched(value, "confirm_password")}
            />
            {!touched.confirm_password ? null : error.confirm_password
                .required ? (
              <p className="text-danger text-[#eb0e14] text-sm text-left">
                Password harus diisi!
              </p>
            ) : error.confirm_password.min_6 ? (
              <p className="text-danger text-[#eb0e14] text-sm text-left">
                Password should be at least 6 character!
              </p>
            ) : error.confirm_password.different ? (
              <p className="text-danger text-[#eb0e14] text-sm text-left">
                Password and confirm password doesn't matched!
              </p>
            ) : null}
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
              Register
            </Button>
          </div>
          <div
            className="flex justify-end mb-2 cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            <p className="text-xs text-gray-400 font-semibold">
              Already join ? Login now !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
