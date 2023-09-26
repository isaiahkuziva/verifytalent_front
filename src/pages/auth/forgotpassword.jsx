import React, { useState } from "react";
import { CustomButton, CustomInput } from "../../components/forms";

import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    API,
    APP_NAME,
    THEMES,
    USER_ENDPOINTS
} from "../../helpers/constants";
import { hideLoading } from "../../redux/slices/loadingSlice";
//import { showSnackbar } from "../../redux/slices/snackbar/snackbarSlice";

const ForgotPasswordPage = () => {
    const [email, setEmail] =useState("")
    const [data, setData] =useState([])
    const navigate = useNavigate();
    const currentTheme = useSelector((state) => state.theme.value);
    const currentUser = useSelector((state) => state.user.value);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const year = new Date().getFullYear();
  
    const navToDashboard = () => navigate("/dashboard");   

  const onChange = (e) => {
    setEmail((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  console.log(email);
  const submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/forgot-password",{email})
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
    };

    API.get(USER_ENDPOINTS.get)
    .then((response) => {
      const tempData = response.data?.users?.filter(
        (user) => user?.email === email
      );
      setData(tempData);
      console.log("UserData" ,tempData);
    })
    .catch((error) => {
     // enqueueSnackbar(getAxiosError(error), { variant: "error" });
     console.log(error);
    })
    .finally (() => {
      dispatch(hideLoading());
    })
    
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

              {/* =========================== down left column ================================ */}
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
          }shadow-lg`}
        >
          <h1 className="mb-2 mt-3 text-3xl font-bold">Forgot Password</h1>
          <p className="text-skin-muted">
            We will send you an email with instructions on how to reset your password.
          </p>

          <form onSubmit={submit} className="mt-14">
            <CustomInput
              placeholder="Email address"
              type="email"
              name="email"
              onChange={onChange}
              required
            />

            <CustomButton name="Proceed" type="submit" />

            <p className="mt-3 text-skin-muted">
              Need Help?{" "}
              <span className="cursor-pointer text-skin-inverted">
                I Do Not Remember My Email!
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
