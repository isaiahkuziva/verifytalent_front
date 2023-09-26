// icons imports
import axios from "axios";
import { AiFillCar } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { Giemployee } from "react-icons/gi";
import {
  MdDashboard,
  MdSettings
} from "react-icons/md";

//export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL = "http://localhost:5000/api/";

export const COMPANY_NAME = import.meta.env.VITE_APP_NAME || "APP NAME";

export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const AUTH_ENDPOINTS = {
  login: "auth/login",
  emailVerification: "auth/email-verification",
  logout: "auth/logout",
  forgotPassword: "auth/forgot-password",
  validateCode: "auth/validate-code",
  authenticate: "/users/authenticate",
};

export const USER_ENDPOINTS = {
  get: "users/",
  update: "/users/",
  delete: "/users/",
  add: "/users/add",
};

export const EMPLOYEE_ENDPOINTS = {
  get: "employees/",
  update: "/employees/",
  delete: "/employees/",
  add: "/employees/add",
};

export const DEPARTMENT_ENDPOINTS = {
  get: "departments/",
  update: "/departments/",
  delete: "/departments/",
  add: "/departments/add",
};

export const BOOKING_ENDPOINTS = {
  get: "bookings/",
  update: "/bookings/",
  delete: "/bookings/",
  add: "/bookings/add",
  addWorker: "/bookings/add-worker/",
  removeWorker: "/bookings/remove-worker/",
  weekly: "/bookings/last7daysbookings",
};

export const getAxiosError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    return error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return error.request.data;
  } else {
    console.error(error);
    return "Internal error occured!";
    // return error.message;
  }
};

export const listScrollbarStyle = `overflow-y-auto h-full scrollbar scrollbar-w-1 scrollbar-thumb-transparent ease-in-out duration-300
hover:scrollbar-thumb-[#737b8b] group-hover:scrollbar-thumb-[#ccc] scrollbar-thumb-rounded-full scrollbar-track-transparent 
scrollbar-w-[4px]`;

export const THEMES = {
  blue: "BLUE",
  dark: "DARK",
};

export const THEME_COLORS = {
  blue: "#17658c",
  dark: "#ffc107",
};

export const getThemeColor = (currentTheme) => {
  const color =
    currentTheme === THEMES.blue ? THEME_COLORS.blue : THEME_COLORS.dark;

  return color;
};

export const handleDarkThemeStyling = (currentTheme, style1, style2) => {
  return currentTheme === THEMES.dark ? style1 : style2;
};

export const dataGridStyle = (currentTheme) => {
  return {
    ".MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "&.MuiDataGrid-root": {
      color: handleDarkThemeStyling(currentTheme, "#fafafa", "black"),
      border: "none",
      // height: "110vh",

      "*::-webkit-scrollbar": {
        width: 5,
        height: 5,
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "#cecece",
        borderRadius: 12,
      },
    },
    "& .MuiDataGrid-columnHeaders": {
      borderColor: handleDarkThemeStyling(currentTheme, "#737b8b", "#edf2f6"),
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "none",
    },
    "& .MuiDataGrid-row": {
      borderRadius: 2,
      "&:hover": {
        background: handleDarkThemeStyling(
          currentTheme,
          "transparent",
          "#edf2f6"
        ),
        color: getThemeColor(currentTheme),
      },
    },
  };
};

export const paginationStyle = (currentTheme) => {
  return {
    ".MuiPaginationItem-rounded": {
      color: currentTheme === THEMES.dark && "white",
    },
    ".Mui-selected": {
      backgroundColor: getThemeColor(currentTheme),
    },
  };
};

export const isPermitted = (currentUser) => {
  const temp = currentUser?.permission !== "READ-ONLY";
  return temp;
};

export const isMasterUser = (currentUser) => {
  const temp = currentUser?.permission === "FULL-ACCESS";
  return temp;
};

export const reactSelectStyle = (currentTheme) => {
  return {
    container: (styles, state) => ({
      ...styles,
      padding: 0,
    }),
    valueContainer: (styles, state) => ({
      ...styles,
      height: "3rem",
      padding: "0 1.25rem",
    }),
    control: (styles, state) => ({
      ...styles,
      borderRadius: "1rem",
      backgroundColor: "transparent",
      "&:hover": {
        border: `0.0625rem solid ${getThemeColor(currentTheme)}`,
      },
    }),

    multiValueRemove: (styles, state) => ({
      ...styles,
      borderRadius: "50%",
    }),
    multiValue: (styles, state) => ({
      ...styles,
      // backgroundColor: "#edf2f6",
      // fontSize: "14px",
      // padding: "0.25rem",
      borderRadius: "1rem",
    }),
    // singleValue: (styles, state) => ({
    //   ...styles,
    //   // backgroundColor: "#edf2f6",
    //   fontSize: "14px",
    //   padding: "8px",
    //   borderRadius: "1rem",
    // }),
    option: (styles, state) => ({
      ...styles,
      "&:first-child": {
        borderRadius: "1rem 1rem 0 0",
      },
      "&:last-child": {
        borderRadius: "0 0 1rem 1rem",
      },
    }),
    menuList: (provided, state) => ({
      ...provided,
      borderRadius: "1rem",
      border: "none",
      padding: 0,
    }),
    menu: (provided, state) => ({
      ...provided,
      borderRadius: "1rem",
      border: "none",
      padding: 0,
    }),
  };
};

// side bar pages
export const sidebarPageList = [
  {
    name: "dashboard",
    route: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    name: "users",
    route: `/users`,
    icon: <FaUsers />,
  },
  {
    name: "employees",
    route: `/employees`,
    icon: <Giemployee />,
  },
  {
    name: "departments",
    route: `/departments`,
    icon: <AiFillCar />,
  },
  // {
  //   name: "departments",
  //   accordionId: `/departments/`,
  //   icon: <AiFillCar />,
  //   list: [
  //     {
  //       name: "all departments",
  //       route: `/departments`,
  //     },

  //   ],
  // },
  {
    name: "settings",
    route: `/settings`,
    icon: <MdSettings />,
  },
];

export const department_TYPES = ["TALENT", "VERIFY", "ETC"];
