import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { MdDelete } from "react-icons/md";

const CustomInput = (props) => {
  return (
    <input
      className={`text-md mb-4 h-12 w-full rounded-2xl border bg-transparent px-5 outline-none
      transition duration-500 ease-in-out hover:border-skin-inverted focus:border-2 focus:border-skin-inverted border-skin-base `}
      {...props}
    />
  );
};

const CustomTextArea = (props) => {
  return (
    <textarea
      className={`text-md mb-4 min-h-[80px] w-full rounded-2xl border border-skin-base px-5 py-3 outline-none
       transition duration-500 ease-in-out hover:border-skin-inverted focus:border-2 
       focus:border-skin-inverted`}
      {...props}
    />
  );
};

const CustomUploadInput = (props) => {
  return (
    <input
      className={`py-auto text-md mb-4 h-12 w-full cursor-pointer overflow-hidden
       rounded-2xl border border-skin-base outline-none transition
        duration-500 ease-in-out file:h-full file:border-0 file:transition file:duration-500 file:ease-in-out 
        hover:border-skin-inverted file:hover:bg-skin-fill-inverted focus:border-2 focus:border-skin-inverted file:focus:bg-skin-fill-inverted`}
      {...props}
      type="file"
    />
  );
};

const CustomButton = (props) => {
  return (
    <button
      {...props}
      className={`my-2 h-12 w-full rounded-2xl bg-skin-button-accent transition 
        duration-500 ease-in-out hover:shadow-xl`}
    >
      {props?.name}
    </button>
  );
};

//check https://react-dropzone.js.org/ for more info
const CustomDropdown = ({ files, setFiles }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 10,
    maxSize: 2097152, //2MB
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      // making the files displayable
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });

  // handle errors
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
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [fileRejections]);

  const removeImage = (index) => {
    setFiles((prev) => {
      const temp = prev.filter((_, i) => i !== index);
      return [...temp];
    });
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-skin-base hover:border-skin-inverted">
        <div
          {...getRootProps({ className: "dropzone" })}
          className="flex h-48 cursor-pointer flex-col items-center justify-center"
        >
          <input {...getInputProps()} />
          <p className="text-lg">
            Drag &#39;
            <span style={{ textTransform: "lowercase" }}>n</span> &#39; drop
            some files here, or click to select files
          </p>
          <em className="text-sm text-skin-muted">
            &#40;Only Max of 10 files allowed&#41;
          </em>
        </div>
      </div>

      {/* ============== displays selected images ==================== */}
      <div className="my-8 flex ">
        {files.map((file, index) => {
          return (
            <div className="relative m-2 rounded-lg" key={index}>
              <MdDelete
                className="absolute -right-2 -top-2 cursor-pointer text-2xl text-red"
                onClick={() => removeImage(index)}
              />
              <img
                className="h-20 w-32 rounded-lg"
                src={file.preview}
                alt="selected"
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export {
  CustomButton, CustomDropdown, CustomInput, CustomTextArea, CustomUploadInput
};

