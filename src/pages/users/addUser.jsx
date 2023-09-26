import MuiModal from "@mui/material/Modal";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "../../components";
import {
  API,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  getAxiosError,
  handleDarkThemeStyling,
} from "../../helpers/constants";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const AddUser = ({ showModal, setShowModal, currentTheme, navigate }) => {
  const [values, setValues] = useState();
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [sentCode, setSentCode] = useState();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useSelector((state) => state.loading.value);
  const userTypes = ["Human Resources Manager", "Admin", "CEO", "Directors"];

  const getType = (value) => {
    setValues((prev) => {
      return {
        ...prev,
        type: value,
      };
    });
  };

  const onChange = (e) => {
    e.preventDefault();
    setValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const getCode = (e) => {
    e.preventDefault();
    setSentCode(e.target.value);
  };

  const confirmVerificationCode = (e) => {
    e.preventDefault();
    if (values && sentCode) {
      dispatch(showLoading());
      const { email } = values;
      API.post(`${AUTH_ENDPOINTS.validateCode}`, { email, code: sentCode })
        .then((response) => {
          if (response.data?.code === sentCode) setIsValidEmail(true);
          else
            enqueueSnackbar("Invalid verification code.", { variant: "error" });
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), { variant: "error" });
        })
        .finally(() => dispatch(hideLoading()));
    }
  };

  const sendVarificationCode = (e) => {
    e.preventDefault();
    if (values && !sentCode) {
      dispatch(showLoading());
      const { email } = values;
      API.post(`${AUTH_ENDPOINTS.emailVerification}`, { email })
        .then((response) => {
          enqueueSnackbar(`Verification code is sent to ${values?.email}`, {
            variant: "success",
          });
          setIsCodeSent(true);
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), { variant: "error" });
        })
        .finally(() => dispatch(hideLoading()));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (values && isValidEmail) {
      dispatch(showLoading());
      API.post(`${USER_ENDPOINTS.add}`, values)
        .then(() => {
          enqueueSnackbar(
            `Admin successfully added. Temporary password is sent to ${values?.email}`,
            { variant: "success" }
          );
          setValues(null);
          setShowModal(false);
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), { variant: "error" });
        })
        .finally(() => {
          dispatch(hideLoading());
          // navigate(0);
        });
    }
  };

  const getPhoneNumber = (value) => {
    setValues((prev) => {
      return {
        ...prev,
        phoneNumber: value,
      };
    });
  };

  return (
    <MuiModal open={showModal} onClose={() => setShowModal(false)}>
      <div
        className={`m-auto mt-12 w-1/2 rounded-2xl p-8 ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient-light",
          "bg-skin-fill"
        )}`}
      >
        <form
          onSubmit={
            isValidEmail
              ? submit
              : sentCode
              ? confirmVarificationCode
              : sendVarificationCode
          }
          className={``}
        >
          {!sentCode && !isCodeSent && !isValidEmail && (
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className={`mb-4 h-12 w-full rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                  currentTheme,
                  "bg-transparent text-white",
                  ""
                )}`}
                onChange={onChange}
              />
            </div>
          )}

          {isCodeSent && !isValidEmail && (
            <div>
              <input
                name="code"
                placeholder="Verification code"
                required
                className={`mb-4 h-12 w-full rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                  currentTheme,
                  "bg-transparent text-white",
                  ""
                )}`}
                onChange={getCode}
              />
            </div>
          )}

          {isValidEmail && (
            <>
              <div>
                <input
                  name="firstName"
                  placeholder="First name"
                  required
                  className={`mb-4 h-12 w-full rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                    currentTheme,
                    "bg-transparent text-white",
                    ""
                  )}`}
                  onChange={onChange}
                />
              </div>

              <div>
                <input
                  name="lastName"
                  placeholder="Last name"
                  required
                  className={`mb-4 h-12 w-full rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                    currentTheme,
                    "bg-transparent text-white",
                    ""
                  )}`}
                  onChange={onChange}
                />
              </div>

              <div>
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="ZA"
                  value={values?.phoneNumber}
                  onChange={getPhoneNumber}
                  className={`mb-4 w-full h-12 rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                    currentTheme,
                    "bg-transparent text-white",
                    ""
                  )}`}
                />
              </div>

              <div>
                <input
                  name="employeeNumber"
                  className={`mb-4 h-12 w-full rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                    currentTheme,
                    "bg-transparent text-white",
                    ""
                  )}`}
                  placeholder="Employee Number"
                  onChange={onChange}
                />
              </div>

              <div
                className={`mb-4 py-1 w-full rounded-xl border border-skin-base placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                  currentTheme,
                  "bg-transparent text-white",
                  ""
                )}`}
              >
                <Dropdown
                  onChange={getType}
                  placeholder="Select user type"
                  list={userTypes}
                />
              </div>
            </>
          )}

          <div className={`mt-8 flex items-center justify-end gap-2`}>
            <button
              disabled={loading}
              className={`h-10 w-24 rounded-xl text-sm duration-300 ease-in-out hover:drop-shadow-2xl ${handleDarkThemeStyling(
                currentTheme,
                "border border-skin-base bg-custom-gradient-light text-white",
                "bg-skin-fill-base"
              )}`}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className={`h-10 w-24 rounded-xl bg-skin-fill-inverted text-sm  duration-300 ease-in-out hover:drop-shadow-2xl`}
            >
              {loading
                ? "Wait..."
                : sentCode && isValidEmail
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
    </MuiModal>
  );
};

export default AddUser;
