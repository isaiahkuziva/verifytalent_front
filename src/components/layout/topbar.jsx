import React, { useState } from "react";

// helpers
import {
  API,
  API_URL,
  AUTH_ENDPOINTS,
  THEMES,
  getAxiosError,
  handleDarkThemeStyling,
} from "../../helpers/constants";

// mui imports
import { Avatar, ClickAwayListener, Tooltip } from "@mui/material";

// icons
import { BsFillBrightnessHighFill, BsFillMoonStarsFill } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, defaultTheme } from "../../redux/slices/themeSlice";

import { useSnackbar } from "notistack";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import { setUser } from "../../redux/slices/userSlice";

const ProfileDropdown = ({ showProfile, setShowProfile, currentTheme }) => {
  const currentUser = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const logout = () => {
    confirmAlert({
      title: "Log out",
      message: "Are you sure you want to do this?",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            dispatch(showLoading());
            API.get(AUTH_ENDPOINTS.logout)
              .then(() => {
                enqueueSnackbar("Successfully logged out!", {
                  variant: "success",
                });

                dispatch(setUser(null));
              })
              .catch((error) => {
                enqueueSnackbar(getAxiosError(error), { variant: "error" });
              })
              .finally(() => {
                dispatch(hideLoading());
              });
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className={`relative flex cursor-pointer items-center justify-center`}>
      <div
        onClick={() => {
          setShowProfile((prev) => !prev);
        }}
      >
        <p
          className={`mr-4 line-clamp-1 text-end font-semibold capitalize leading-5 ${handleDarkThemeStyling(
            currentTheme,
            "text-white",
            ""
          )}`}
        >
          {currentUser?.firstName} {currentUser?.lastName}
        </p>
        <p
          className={`text-small mr-4 line-clamp-1 text-end lowercase leading-5 text-skin-muted`}
        >
          {currentUser?.email}
        </p>
      </div>

      <div
        onClick={() => {
          setShowProfile((prev) => !prev);
        }}
      >
        <Avatar
          alt={`mansa mario`}
          sx={{ width: 40, height: 40 }}
          src={API_URL + currentUser?.avatar}
        />
      </div>

      {/* dropdown */}
      <div
        className={`absolute right-0 top-[120%] z-10 w-44 overflow-hidden rounded-xl bg-skin-fill-base drop-shadow-2xl ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient text-skin-muted",
          ""
        )}`}
        style={{ display: showProfile ? "block" : "none" }}
      >
        <div
          className={`flex cursor-pointer items-center px-4 py-2 pt-4 duration-300 ${handleDarkThemeStyling(
            currentTheme,
            "bg-custom-gradient-light hover:bg-custom-gradient",
            "bg-skin-fill hover:bg-skin-fill-base"
          )}`}
          onClick={() => navigate("/profile")}
        >
          <FiUser className={`mr-4 text-lg text-skin-inverted`} />
          <p>Profile</p>
        </div>

        <div
          className={`flex cursor-pointer items-center px-4 py-2 pt-4 duration-300 ${handleDarkThemeStyling(
            currentTheme,
            "bg-custom-gradient-light hover:bg-custom-gradient",
            "bg-skin-fill hover:bg-skin-fill-base"
          )}`}
          onClick={logout}
        >
          <MdLogout className={`mr-4 text-lg text-red`} />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

const Topbar = () => {
  // icon dropdown hooks
  const [showProfile, setShowProfile] = useState(false);
  const [changeTheme, setChangeTheme] = useState(false);

  // redux hooks
  const currentTheme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  // changing icons based on the current theme
  const themeIcon = () => {
    if (currentTheme === THEMES.dark)
      return <BsFillMoonStarsFill className="text-lg text-white" />;

    return <BsFillBrightnessHighFill className="text-lg text-white" />;
  };

  return (
    <div className="z-10 w-full">
      <div className="mx-12 mt-2 flex flex-1 items-start justify-between pt-3">
        {/* =============== theme button ======================= */}
        <div className="flex">
          {/* theme button */}
          <ClickAwayListener
            onClickAway={() => {
              setChangeTheme(false);
            }}
          >
            <Tooltip title="Change theme" placement="right" arrow>
              <div
                className={`relative mr-5 flex h-11 w-11 cursor-pointer items-center justify-center 
                          rounded-lg bg-skin-fill-inverted`}
                onClick={() => {
                  setChangeTheme((prev) => !prev);
                }}
              >
                {/* icon changes dynamically */}
                {themeIcon()}

                {/* dropdown */}
                <div
                  className={`absolute left-0 top-[120%] z-10 rounded-xl drop-shadow-2xl`}
                  style={{ display: changeTheme ? "block" : "none" }}
                >
                  <div
                    className={`inline-flex items-center rounded-lg px-3 py-2 duration-300`}
                  >
                    <div
                      className={`mr-4 h-6 w-6 rounded-md border border-color-fill-base bg-white drop-shadow-2xl`}
                      onClick={() => dispatch(defaultTheme())}
                    />
                    <div
                      className={`h-6 w-6 rounded-md bg-custom-dark drop-shadow-2xl`}
                      onClick={() => dispatch(darkTheme())}
                    />
                  </div>
                </div>
              </div>
            </Tooltip>
          </ClickAwayListener>
        </div>

        {/* ============== right side content ========================== */}
        <div className="flex items-center">
          {/*user profile */}
          <ClickAwayListener
            onClickAway={() => {
              setShowProfile(false);
            }}
          >
            <div>
              <ProfileDropdown
                showProfile={showProfile}
                setShowProfile={setShowProfile}
                currentTheme={currentTheme}
              />
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
