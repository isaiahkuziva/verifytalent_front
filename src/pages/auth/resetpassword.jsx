import React, { useState } from "react";
import { CustomButton, CustomInput } from "../../components/forms";

import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    API,
    APP_NAME,
    AUTH_ENDPOINTS,
    THEMES,
    getAxiosError,
} from "../../helpers/constants";
import { hideLoading } from "../../redux/slices/loadingSlice";
//import { showSnackbar } from "../../redux/slices/snackbarSlice";
import { setUser } from "../../redux/slices/userSlice";

axios.default.withCredentials = true;

const ResetPassword = () => {
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const currentTheme = useSelector((state) => state.theme.value);
  const currentUser = useSelector((state) => state.user.value);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const year = new Date().getFullYear();

  const navToDashboard = () => navigate("/dashboard");

  const onChange = (e) => {
    e.preventDefault();
    setPassword((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/forgot-password",{password})
    .then(res => {
      if(res.data.Status === "Success"){
          dispatch(showSnackbar("Password reset link has been sent to your email.", "success"));
          navigate("../auth/signin");
      } else {
        dispatch(showSnackbar("Failed to send reset password email.", "error"));
      }
    }).catch((err) => {
      dispatch(showSnackbar("An error occurred. Please try again later.", "error"));
      console.log(err);
    });
    
    API.post(AUTH_ENDPOINTS.resetpassword)
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
              <h1 className="my-2 text-3xl">Verify Talent App</h1>
              <p className="text-md">
                we help you verify talent
              </p>

              {/* =========================== bottom left ================================ */}
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
          <h1 className="mb-2 mt-3 text-3xl font-bold">Reset Password</h1>
          <p className="text-skin-muted">
            Fill in below to get started
          </p>

          <form onSubmit={submit} className="mt-14">
            <CustomInput
              placeholder="New Password"
              type="password"
              name="enter your new password"
              onChange={onChange}
              required
            />
            <CustomInput
              placeholder="Confirm Password"
              name="confirm your password"
              type="password"
              onChange={onChange}
              required
            />

            <CustomButton name="Update" type="submit" />

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;