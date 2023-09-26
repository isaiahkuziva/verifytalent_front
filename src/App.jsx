import { SnackbarProvider } from "notistack";
import React from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from "react-router-dom";
import { Layout } from "./components";

import { Circles } from "react-loading-icons";

import ForgotPasswordPage from "./pages/auth/forgotpasswordpage";
import ResetPassword from "./pages/auth/resetpassword";
import Signin from "./pages/auth/signin";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";

import ManageDepartment from "../pages/departments/ManageDepartment";
import { department_ENDPOINTS, getThemeColor, THEMES } from "./helpers/constants";
import ErrorPage from "./pages/errors";
import SingleUser from "./pages/users/singleUser";

const LoadingScreen = ({ theme }) => {
  return (
    <div
      className={`absolute inset-0 z-[1005] flex flex-col items-center justify-center bg-black bg-opacity-60`}
    >
      <Circles fill={getThemeColor(theme)} height="3rem" speed={2} />
    </div>
  );
};

// I'm just avoiding having '/' page route
const homeLoader = async () => {
  return redirect("/auth/signin");
};

const departmentLoader = async ({ params }) => {
  const response = await API.get(department_ENDPOINTS.get + params?.id);
  const department = await response?.data;
  return {
    department,
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    loader: homeLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/signin",
    errorElement: <ErrorPage />,
    element: <Signin />,
  },
  {
    path: "/auth/ForgotPasswordPage",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/auth/resetpassword/:id/:token",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "employees",
        element: <Dashboard />,
      },
      {
        path: "AddEmployee",
        element: <AddEmployee />,
      },
      {
        path: "departments",
        element: <department />,
      },
      {
        path: "add-department",
        element: <ManageDepartment />,
      },
      {
        path: "edit-department",
        loader: departmentLoader,
        element: <ManageDepartment />,
      },
      {
        path: "profile",
        element: <SingleUser />,
      },
    ],
  },
  
]);

const App = () => {
  const theme = useSelector((state) => state.theme.value);
  const loading = useSelector((state) => state.loading.value);

  return (
    <SnackbarProvider maxSnack={3}>
      <div className={` ${theme === THEMES.dark && `theme-dark`}`}>
        <RouterProvider router={router} />
        {loading && <LoadingScreen theme={theme} />}
      </div>
    </SnackbarProvider>
  );
};

export default App;
