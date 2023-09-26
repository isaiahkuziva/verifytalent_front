import MuiModal from "@mui/material/Modal";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  API,
  getAxiosError,
  handleDarkThemeStyling
} from "../../helpers/constants";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";

const Media = ({ images, setImages, currentTheme }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 8,
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
      <div
        className={`w-32 overflow-hidden rounded-lg border border-skin-base ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient-light text-white",
          "bg-skin-fill"
        )}`}
      >
        <div
          {...getRootProps({ className: "dropzone" })}
          className="flex h-24 cursor-pointer flex-col items-center justify-center  p-4 text-center"
        >
          <input {...getInputProps()} />
          <p className="text-sm">Click to select Images</p>
        </div>
      </div>

      <div className="my-8 flex gap-3">
        {images.map((data, i) => {
          return (
            <div key={i} className="relative rounded-lg">
              <MdDelete
                className="absolute -right-2 -top-2 cursor-pointer text-2xl text-red"
                onClick={() => removeImage(i)}
              />
              <img
                className="h-20 w-24 rounded-lg"
                src={data.preview}
                alt="selected"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ManageDepartment = ({
  showModal,
  setShowModal,
  currentUser,
  currentTheme,
  navigate,
}) => {
  const [values, setValues] = useState();
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useSelector((state) => state.loading.value);

  const onChange = (e) => {
    e.preventDefault();
    setValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const submit = (e) => {
    e.preventDefault();
    if (values) {
      const sendData = {
        ...values,
        images,
        editor: currentUser,
      };

      dispatch(showLoading());
      API.post(`${DEPARTMENTS_ENDPOINTS.add}`, sendData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          enqueueSnackbar(`department added successfully.`, {
            variant: "success",
          });
          setValues(null);
          setShowModal(false);
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), { variant: "error" });
        })
        .finally(() => {
          dispatch(hideLoading());
        });
    }
  };

  const FIELDS = [
    {
      name: "name",
      required: true,
      placeholder: "Name",
      onChange,
    },
    {
      name: "make",
      required: true,
      placeholder: "Make",
      onChange,
    },
    {
      name: "description",
      required: true,
      placeholder: "Description",
      onChange,
    },
    {
      name: "company",
      required: true,
      placeholder: "company",
      onChange,
    },
  ];

  return (
    <MuiModal open={showModal} onClose={() => setShowModal(false)}>
      <div
        className={`m-auto mt-12 w-1/2 rounded-2xl p-8 ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient-light",
          "bg-skin-fill"
        )}`}
      >
        <div className="mb-8">
          <Media
            images={images}
            setImages={setImages}
            currentTheme={currentTheme}
          />
        </div>

        <form onSubmit={submit} className={``}>
          {FIELDS.map((data, i) => {
            return (
              <div className="mb-4" key={i}>
                <input
                  name={data?.name}
                  placeholder={data?.placeholder}
                  required={data?.required || false}
                  className={`h-12 w-full rounded-xl border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                    currentTheme,
                    "bg-transparent text-white",
                    ""
                  )}`}
                  onChange={data?.onChange}
                />
              </div>
            );
          })}

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
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </MuiModal>
  );
};

export default ManageDepartment;
