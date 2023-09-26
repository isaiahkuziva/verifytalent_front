import React, { useCallback, useEffect } from "react";

import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import MuiModal from "@mui/material/Modal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/forms";
import {
  API,
  API_URL,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  getAxiosError,
  handleDarkThemeStyling,
} from "../../helpers/constants";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import { setUser } from "../../redux/slices/userSlice";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Media = ({ images, setImages, currentUser, currentTheme }) => {
  // const [images, setImages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2097152, //2MB
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setImages(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });

  useEffect(() => {
    fileRejections.forEach((file) => {
      if (file.errors[0]) {
        enqueueSnackbar(file.errors[0].message, {
          variant: "error",
        });
        return;
      }
    });

    return () => {
      images.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [fileRejections]);

  const removeImage = (index) => {
    setImages((prev) => {
      const temp = prev.filter((_, i) => i !== index);
      return [...temp];
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="my-8 flex ">
        {(currentUser?.avatar || images.length > 0) && (
          <div className="relative m-2 rounded-lg">
            <MdDelete
              className="absolute -right-2 -top-2 cursor-pointer text-2xl text-red"
              onClick={() => removeImage(0)}
            />
            <img
              className="h-40 w-44 rounded-lg"
              src={
                images.length
                  ? images[0].preview
                  : API_URL + currentUser?.avatar
              }
              alt="selected"
            />
          </div>
        )}
      </div>

      <div
        className={`w-40 overflow-hidden rounded-lg border border-skin-base ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient-light text-white",
          "bg-skin-fill"
        )}`}
      >
        <div
          {...getRootProps({ className: "dropzone" })}
          className="flex h-40 cursor-pointer flex-col items-center justify-center  p-4 text-center"
        >
          <input {...getInputProps()} />
          <p className="text-sm">
            Drag &#39;
            <span style={{ textTransform: "lowercase" }}>n</span>&#39; drop or
            click to select an Image
          </p>
        </div>
      </div>
    </div>
  );
};

const EmailModel = ({ currentTheme, editEmail, setEditEmail, setValues }) => {
  const [email, setEmail] = useState();
  const [sentCode, setSentCode] = useState();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useSelector((state) => state.loading.value);

  const onChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const getCode = (e) => {
    e.preventDefault();
    setSentCode(e.target.value);
  };

  const confirmVarificationCode = (e) => {
    e.preventDefault();
    if (email && sentCode) {
      dispatch(showLoading());
      API.post(`${AUTH_ENDPOINTS.validateCode}`, { email, code: sentCode })
        .then((response) => {
          if (response.data?.code === sentCode) {
            setValues((prev) => {
              return {
                ...prev,
                email,
              };
            });
            setEditEmail(false);
          } else
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
    if (email && !sentCode) {
      dispatch(showLoading());
      API.post(`${AUTH_ENDPOINTS.emailVerification}`, { email })
        .then((response) => {
          enqueueSnackbar(`Verification code is sent to ${email}`, {
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

  const closeModal = () => {
    setIsCodeSent(false);
    setSentCode(null);
    setEditEmail(false);
  };

  return (
    <MuiModal open={editEmail} onClose={closeModal}>
      <div
        className={`m-auto mt-12 h-fit w-1/2 rounded-2xl p-8 ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient-light",
          "bg-skin-fill"
        )}`}
      >
        <form
          onSubmit={isCodeSent ? confirmVarificationCode : sendVarificationCode}
          className={``}
        >
          {!isCodeSent && (
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

          {isCodeSent && (
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

          <div className={`mt-8 flex items-center justify-end gap-2`}>
            <button
              disabled={loading}
              className={`h-10 w-24 rounded-xl text-sm duration-300 ease-in-out hover:drop-shadow-2xl ${handleDarkThemeStyling(
                currentTheme,
                "border border-skin-base bg-custom-gradient-light text-white",
                "bg-skin-fill-base"
              )}`}
              onClick={() => setEditEmail(false)}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className={`h-10 w-24 rounded-xl bg-skin-fill-inverted text-sm  duration-300 ease-in-out hover:drop-shadow-2xl`}
            >
              {loading ? "Wait..." : sentCode ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </MuiModal>
  );
};

const SingleUser = () => {
  const [images, setImages] = useState([]);
  const [values, setValues] = useState();
  const [editPassword, setEditPassword] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const currentUser = useSelector((state) => state.user.value);
  const currentTheme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const deleteAdmin = () => {
    confirmAlert({
      title: "Delete Admin",
      message: "Are you sure you want to do this?",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            dispatch(showLoading());
            API.delete(`${USER_ENDPOINTS.delete}${currentUser?._id}`)
              .then(() => {
                enqueueSnackbar("Successfully deleted!", {
                  variant: "success",
                });

                navigate("/auth/signin");
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

  const onChange = (e) => {
    e.preventDefault();
    setValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (values || images.length) {
      const data = {
        ...values,
        avatar: images[0],
      };

      dispatch(showLoading());

      API.patch(USER_ENDPOINTS.update + currentUser?._id, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          enqueueSnackbar("Your information is updated successfully!", {
            variant: "success",
          });

          dispatch(setUser(response.data));
          setValues(null);
          setEditPassword(false);
        })
        .catch((error) =>
          enqueueSnackbar(getAxiosError(error), {
            variant: "error",
          })
        )
        .finally(() => dispatch(hideLoading()));
    }
  };

  const getPhoneNumber = useCallback((value) => {
    setValues((prev) => {
      return {
        ...prev,
        phoneNumber: value,
      };
    });
  }, []);


  return (
    <div>
      <h2 className={`text-2xl font-semibold`}>My profile</h2>

      <div
        className={`mt-12 overflow-hidden rounded-3xl p-8 shadow-lg ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient text-white",
          "bg-skin-fill"
        )} `}
      >
        {/* delete */}
        <div className="flex justify-end">
          <button
            onClick={deleteAdmin}
            className=" h-11 rounded-xl bg-red px-4 text-sm"
          >
            Delete Account
          </button>
        </div>

        {/* images */}
        <div className="mt-8">
          <Media
            images={images}
            setImages={setImages}
            currentUser={currentUser}
            currentTheme={currentTheme}
          />
        </div>

        <form onSubmit={onSubmit} className="mt-12">
          <div
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
            }}
            className="grid gap-8"
          >
            <CustomInput
              name="firstName"
              onChange={onChange}
              placeholder="Enter first name"
              defaultValue={currentUser?.firstName}
            />
            <CustomInput
              name="lastName"
              onChange={onChange}
              placeholder="Enter first name"
              defaultValue={currentUser?.lastName}
            />

            <div className="relative ">
              <CustomInput
                name="email"
                type="email"
                value={values?.email || currentUser?.email}
                disabled
              />

              <p
                onClick={() => setEditEmail((prev) => !prev)}
                className="absolute right-4 top-4 z-10 cursor-pointer text-sm text-skin-inverted"
              >
                Edit
              </p>
            </div>

            <PhoneInput
              placeholder="Enter phone number"
              defaultCountry="ZA"
              value={values?.phoneNumber || currentUser?.phoneNumber}
              onChange={getPhoneNumber}
              className={`mb-4 w-full h-12 rounded-2xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                currentTheme,
                "bg-transparent text-white",
                ""
              )}`}
            />

            <div className="relative ">
              <CustomInput
                name="oldPassword"
                disabled={!editPassword}
                type={showPassword ? "text" : "password"}
                onChange={onChange}
                placeholder={
                  editPassword ? "Enter current password" : "Edit password"
                }
              />

              {editPassword ? (
                <p
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-4 z-10 cursor-pointer text-sm text-skin-inverted"
                >
                  {showPassword ? <span>hide</span> : <span>show</span>}
                </p>
              ) : (
                <p
                  onClick={() => setEditPassword((prev) => !prev)}
                  className="absolute right-4 top-4 z-10 cursor-pointer text-sm text-skin-inverted"
                >
                  Edit
                </p>
              )}
            </div>

            {values?.oldPassword && (
              <div className="relative ">
                <CustomInput
                  name="password"
                  disabled={!editPassword}
                  type={showPassword2 ? "text" : "password"}
                  onChange={onChange}
                  placeholder="Enter new password"
                />

                <p
                  onClick={() => setShowPassword2((prev) => !prev)}
                  className="absolute right-4 top-4 z-10 cursor-pointer text-sm text-skin-inverted"
                >
                  {showPassword2 ? <span>hide</span> : <span>show</span>}
                </p>
              </div>
            )}
          </div>

          {(values || images.length > 0) && (
            <div
              className={`mt-14 flex items-center justify-end gap-4 text-sm`}
            >
              <button
                type="submit"
                className={`h-10 w-24 rounded-xl bg-skin-fill-inverted text-white duration-300 ease-in-out hover:drop-shadow-2xl`}
              >
                Submit
              </button>
            </div>
          )}
        </form>

        <EmailModel
          currentTheme={currentTheme}
          editEmail={editEmail}
          setEditEmail={setEditEmail}
          setValues={setValues}
        />
      </div>
    </div>
  );
};

export default SingleUser;
