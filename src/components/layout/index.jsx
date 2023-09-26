import React, { useEffect, useState } from "react";

// components
import Topbar from "./topbar";

// react-icons
import { HiArrowNarrowRight } from "react-icons/hi";

// react router dom imports
import { Outlet, useNavigate } from "react-router-dom";

// helpers imports
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import {
  API,
  AUTH_ENDPOINTS,
  getAxiosError,
  handleDarkThemeStyling,
} from "../../helpers/constants";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import { setUser } from "../../redux/slices/userSlice";
import Sidebar from "./sidebar";

const Layout = () => {
  const [shrinkBar, setShrinkBar] = useState(false); // for show min sidebar
  const currentTheme = useSelector((state) => state.theme.value);
  const currentUser = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // retrieve user data on page refresh
  useEffect(() => {
    if (!currentUser) {
      dispatch(showLoading());
      API.get(AUTH_ENDPOINTS.authenticate)
        .then((response) => {
          const { password, ...temp } = response.data;
          dispatch(setUser(temp));
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), {
            variant: "error",
          });
          navigate("/auth/signin");
        })
        .finally(() => dispatch(hideLoading()));
    }
  }, [currentUser]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ============= sidebar =============== */}
      <Sidebar
        shrinkBar={shrinkBar}
        setShrinkBar={setShrinkBar}
        currentTheme={currentTheme}
      />

      {/* ============= content ================ */}
      <section className="relative h-full w-full overflow-hidden">
        {/* topbar */}
        <div className={`flex items-center`}>
          {shrinkBar && (
            <HiArrowNarrowRight
              className={`ml-4 mt-4 cursor-pointer text-4xl text-skin-inverted`}
              onClick={() => setShrinkBar(false)}
            />
          )}
          <Topbar shrinkBar={shrinkBar} />
        </div>

        <div
          className={`relative h-full max-h-full w-full overflow-auto scrollbar 
        scrollbar-thumb-rounded-full scrollbar-w-[.70rem] 
         scrollbar-h-[.70rem] hover:scrollbar-thumb-[#737b8b] ${handleDarkThemeStyling(
           currentTheme,
           "scrollbar-thumb-[#555]",
           "scrollbar-thumb-[#cecece]"
         )}`}
        >
          <main className="mx-12 py-24">
            <Outlet />
          </main>
        </div>
      </section>
    </div>
  );
};

export default Layout;
