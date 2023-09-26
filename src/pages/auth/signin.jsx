import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CustomButton, CustomInput } from "../../components/forms";

import { AiFillInstagram } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  API,
  APP_NAME,
  AUTH_ENDPOINTS,
  THEMES,
  getAxiosError,
} from "../../helpers/constants";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import { setUser } from "../../redux/slices/userSlice";

const Signin = () => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const currentTheme = useSelector((state) => state.theme.value);
  const currentUser = useSelector((state) => state.user.value);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const year = new Date().getFullYear();

  const navToDashboard = () => navigate("/dashboard");

  // retrieve user data on page refresh
  useEffect(() => {
    if (!currentUser) {
      dispatch(showLoading());
      API.get(AUTH_ENDPOINTS.authenticate)
        .then((response) => {
          const { password, ...temp } = response.data;
          dispatch(setUser(temp));
          navToDashboard();
        })
        .finally(() => dispatch(hideLoading()));
    }
  }, []);

  const socialMedia = [
    {
      icon: <FaFacebookF />,
      url: "#",
    },
    {
      icon: <BsTwitter />,
      url: "#",
    },
    {
      icon: <AiFillInstagram />,
      url: "#",
    },
    {
      icon: <FaLinkedinIn />,
      url: "#",
    },
  ];

  const onChange = (e) => {
    e.preventDefault();
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(showLoading());

    API.post(AUTH_ENDPOINTS.login, userData)
      .then((response) => {
        dispatch(setUser(response.data));
        navToDashboard();
      })
      .catch((error) =>
        enqueueSnackbar(getAxiosError(error), {
          variant: "error",
        })
      )
      .finally(() => dispatch(hideLoading()));
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex min-h-[500px] w-[85%] overflow-hidden rounded-xl shadow-2xl ">
        {/* =========================== left column ================================ */}
        <div className="relative flex-1 bg-[url('../assets/login.jpg')] bg-cover max-[900px]:hidden ">
          <div className="h-full w-full bg-gradient-to-br from-skin-hue via-skin-hue/80 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-between bg-skin-fill-inverted bg-opacity-50 px-10 py-12 text-white">
            <div className="flex items-end">
              <div
                // alt="logo"
                // src={logoImage}
                // loading="lazy"
                className="h-20 w-20 rounded-full rounded-b-full bg-skin-fill-muted"
              />

              <h1 className="mb-1 ml-2 text-3xl">Logo</h1>
            </div>

            <div>
              <h1 className="my-2 text-3xl">Welcome To VERIFY TALENT APP</h1>
              <p className="text-md">
                we help you verify talent
              </p>

              {/* =========================== social media ================================ */}
              <div className="mb-4 mt-10 flex">
                {socialMedia.map((item, i) => {
                  return (
                    <a
                      key={i}
                      target="_blank"
                      href={item?.url}
                      rel="noopener noreferrer"
                      className="mr-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-[#ffffff48] text-xl shadow transition duration-700 ease-in-out hover:bg-white hover:text-skin-inverted"
                    >
                      {item?.icon}
                    </a>
                  );
                })}
              </div>
              <p>
                Copyright © {APP_NAME} {year}. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>

        {/* =========================== right column ================================ */}
        <div
          className={`w-[40%] px-10 py-12 max-[900px]:w-full ${
            currentTheme === THEMES.dark && "bg-custom-gradient-light"
          }`}
        >
          <h1 className="mb-2 mt-3 text-3xl font-bold">Sign in</h1>
          <p className="text-skin-muted">
            Sign in by entering information below
          </p>

          <form onSubmit={submit} className="mt-14">
            <CustomInput
              placeholder="Email address"
              type="email"
              name="email"
              onChange={onChange}
              required
            />
            <CustomInput
              placeholder="Password"
              name="password"
              type="password"
              onChange={onChange}
              required
            />

            <CustomButton name="Sign in" type="submit" />

            <p className="mt-3 text-skin-muted">
              Forgot password?{" "}
              <span className="cursor-pointer text-skin-inverted">
                <Link to={'../auth/ForgotPasswordPage'}>Click here</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
