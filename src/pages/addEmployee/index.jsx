import { useSnackbar } from "notistack";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    API,
    EMPLOYEE_ENDPOINTS,
    getAxiosError,
    handleDarkThemeStyling,
} from "../../helpers/constants";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import { selectCurrentUser } from '../../redux/slices/userSlice';


const defaultValues = {
    images: [],
    firstName: "",
    middleName: "",
    lastName: "",
    date_hired: "",
    employeeID_CODE: "",
    birthday: "",
    gender: "",
    email: "",
    contact: "",
    department: "",
    role: "",
    address: {
        street: "",
        suburb: "",
        city: "",
        province: "",
        country: "",
    },
};


const AddEmployee = ({ currentTheme }) => {

    const navigate = useNavigate();
    const [values, setValues] = useState(defaultValues);
    const [sentCode, setSentCode] = useState();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const loading = useSelector((state) => state.loading.value);

    const currentUser = useSelector(selectCurrentUser);



    const handleDrop = (acceptedFiles) => {
        setValues((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                ...acceptedFiles.map((file) => ({
                    ...file,
                    preview: URL.createObjectURL(file),
                })),
            ],
        }));
    };

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 5,
        maxSize: 2097152, // 2MB
        accept: "image/*",
        onDrop: handleDrop,
    });

    const handleRemoveImage = (index) => {
        setValues((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (['street', 'suburb', 'city', 'province', 'country'].includes(name)) {
            setValues((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [name]: value,
                },
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleDateChange = (date) => {
        setValues((prevValues) => ({
            ...prevValues,
            date: date,
        }));
    };


    const submit = (e) => {
        e.preventDefault();
        if (values && currentUser) {
            dispatch(showLoading());
            const requestData = {
                ...values,
                editor: currentUser._id,
            };
            API.post(`${EMPLOYEE_ENDPOINTS.add}`, requestData)
                .then(() => {
                    enqueueSnackbar(`employee successfully added`, { variant: "success" });
                    setValues(null);
                })
                .catch((error) => {
                    enqueueSnackbar(getAxiosError(error), { variant: "error" });
                })
                .finally(() => {
                    dispatch(hideLoading());
                });
        }
    };

    console.log('Values :', values)

    const handleAddCancelClick = () => {
        navigate('/employees');
    };

    return (
        <div
            className={`m-auto w-full rounded-2xl p-8 ${handleDarkThemeStyling(
                currentTheme,
                "bg-custom-gradient-light",
                "bg-skin-fill"
            )}`}
        >
    
            <div className="mt-2 mb-8 w-full font-bold text-3xl text-gray-500  blink-once">
                <h1 className="font-extrabold text-4xl uppercase">
                    employee Information
                </h1>
            </div>



            <form
                onSubmit={submit}
                className={``}
            >

                <div className="mt-2 mb-4 w-full font-bold text-base">
                    <h1 className="text-gray-100 font-semibold text-xl uppercase">
                       Details
                    </h1>
                </div>

                <div>
                    <div className={`mb-4 h-12 w-full p-8 h-auto rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                        currentTheme,
                        "bg-transparent text-white",
                        ""
                    )}`}>
                        <div className="flex justify-between space-x-4">

                            <input
                                name="firstName"
                                type="string"
                                placeholder="First Name"
                                required
                                className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values ? values.firstName : ""}
                            />

                            <input
                                name="middleName"
                                type="string"
                                placeholder="Middle Name"
                                required
                                className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values ? values.middleName : ""}
                            />

                            <input
                                name="lastName"
                                type="string"
                                placeholder="Last Name"
                                required
                                className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values ? values.lastName : ""}
                            />

                            <input
                                name="contact"
                                type="number"
                                placeholder="Contact"
                                required
                                className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.contact}
                            />
                        </div>

                        <div className="flex justify-between mb-4 space-x-4">
                            <div className="flex-grow">
                                <DatePicker
                                    selected={values.date_hired}
                                    onChange={handleDateChange}
                                    placeholderText="Date Hired"
                                    dateFormat="yyyy-MM-dd"
                                    className="h-12 w-full rounded border border-skin-base px-4 text-gray-500 placeholder-opacity-50 outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted"
                                    wrapperClassName="w-full"
                                    calendarClassName="bg-white border border-skin-base"
                                    isClearable
                                />
                            </div>

                            <div className="flex-grow">
                                <DatePicker
                                    selected={values.birthday}
                                    onChange={handleDateChange}
                                    placeholderText="Birthday"
                                    dateFormat="yyyy-MM-dd"
                                    className="h-12 w-full rounded border border-skin-base px-4 text-gray-500 placeholder-opacity-50 outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted"
                                    wrapperClassName="w-full"
                                    calendarClassName="bg-white border border-skin-base"
                                    isClearable
                                />
                            </div>

                            <div className="flex-grow"> 
                                <input
                                    name="employeeID_CODE"
                                    type="string"
                                    placeholder="ID / CODE"
                                    required
                                    className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                        currentTheme,
                                        "bg-transparent text-white",
                                        ""
                                    )}`}
                                    onChange={handleChange}
                                    value={values.employeeID_CODE}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between space-x-4">

                            <input
                                name="role"
                                type="string"
                                placeholder="Role"
                                required
                                className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.branch}
                            />

                            <input
                                name="department"
                                type="string"
                                placeholder="Department"
                                required
                                className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.department}
                            />

                        </div>

                        <input
                            name="email"
                            type="string"
                            placeholder="Email"
                            required
                            className={`mb-4 h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                currentTheme,
                                "bg-transparent text-white",
                                ""
                            )}`}
                            onChange={handleChange}
                            value={values.email}
                        />

                    </div>

                    <div className="mt-2 mb-4 w-full font-bold text-base">
                        <h1 className="text-gray-100 font-semibold text-xl uppercase">
                           Address
                        </h1>
                    </div>



                    <div className={`h-12 w-full p-8 h-auto rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                        currentTheme,
                        "bg-transparent text-white",
                        ""
                    )}`}>

                        <div className="flex justify-between mb-4 space-x-4">
                            <input
                                name="street"
                                type="string"
                                placeholder="Street"
                                required
                                className={` h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.location.street}
                            />

                            <input
                                name="suburb"
                                type="string"
                                placeholder="Suburb"
                                required
                                className={` h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.location.suburb}
                            />

                            <input
                                name="city"
                                type="string"
                                placeholder="City"
                                required
                                className={`h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.location.city}
                            />


                        </div>

                        <div className="flex justify-between mb-4 space-x-4">

                            <input
                                name="province"
                                type="string"
                                placeholder="Province"
                                required
                                className={`h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.location.province}
                            />

                            <input
                                name="country"
                                type="string"
                                placeholder="Country"
                                required
                                className={`h-12 w-full rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                                    currentTheme,
                                    "bg-transparent text-white",
                                    ""
                                )}`}
                                onChange={handleChange}
                                value={values.location.country}
                            />
                        </div>

                    </div>

                    <div className="mt-2 mb-4 w-full font-bold text-base">

                    </div>


                    <div className={`mb-8 h-12 w-full p-8 h-auto rounded border border-skin-base px-4 placeholder-color-gray outline-none duration-300 ease-in hover:border-skin-inverted focus:border-skin-inverted ${handleDarkThemeStyling(
                        currentTheme,
                        "bg-transparent text-white",
                        ""
                    )}`}>

                        <div className="flex justify-between mb-4 space-x-4">

                        </div>


                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`w-40 overflow-hidden rounded-lg border border-skin-base`} {...getRootProps()}>
                            <div className="flex h-40 cursor-pointer flex-col items-center justify-center p-4 text-center">
                                <input {...getInputProps()} />
                                <p className="text-sm">
                                    Drag &#39;
                                    <span style={{ textTransform: "lowercase" }}>n</span>&#39; drop or
                                    click to select images
                                </p>
                            </div>
                        </div>

                        <div className="my-8 flex flex-wrap">
                            {values.images.map((image, index) => (
                                <div key={index} className="relative m-2 rounded-lg">
                                    <IoMdClose
                                        className="absolute -right-2 -top-2 cursor-pointer text-2xl text-red"
                                        onClick={() => handleRemoveImage(index)}
                                    />
                                    <img
                                        className="h-14 w-14 rounded-lg"
                                        src={image.preview}
                                        alt={`Image ${index}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className={`mt-8 flex items-center justify-end gap-2`}>
                    <button
                        disabled={loading}
                        className={`h-10 w-24 rounded-xl text-sm duration-300 ease-in-out hover:drop-shadow-2xl ${handleDarkThemeStyling(
                            currentTheme,
                            "border border-skin-base bg-custom-gradient-light text-white",
                            "bg-skin-fill-base"
                        )}`}
                        onClick={handleAddCancelClick}
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        className={`h-10 w-24 rounded-xl bg-skin-fill-inverted text-sm  duration-300 ease-in-out hover:drop-shadow-2xl`}
                    >
                        {loading
                            ? "Wait..."
                            : sentCode
                            ? "Submit"
                            : "Next"}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default AddEmployee;