import { useCallback, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import {
  API,
  API_URL,
  dataGridStyle,
  DEPARTMENT_ENDPOINTS,
  getAxiosError,
  handleDarkThemeStyling,
  isMasterUser,
  isPermitted,
} from "../../helpers/constants";

import { Avatar } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import QRCode from "qrcode";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import ManageDepartment from "./manageDepartment";

const departments = () => {
  const loaderData = useLoaderData();
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numDepartments, setNumDepartments] = useState(loaderData?.numDepartments || 0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.value);
  const currentUser = useSelector((state) => state.user.value);
  const [data, setData] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [initialData, setInitialData] = useState([]);
  const [initialNumData, setInitialNumData] = useState(0);

  useEffect(() => {
    dispatch(showLoading());
    API.get(DEPARTMENT_ENDPOINTS.get)
      .then((response) => {
        setData(response.data?.departments);
        setNumDepartments(response.data?.numDepartments);

        setInitialData(response.data?.departments);
        setInitialNumData(response.data?.numDepartments);
      })
      .catch((error) => {
        enqueueSnackbar(getAxiosError(error), { variant: "error" });
      })
      .finally(() => {
        dispatch(hideLoading());
      });
  }, []);

  // for searching
  useEffect(() => {
    if (keyword?.length && keyword?.length > 2) {
      setLoading(true);
      API.get(`${DEPARTMENT_ENDPOINTS.get}?keyword=${keyword}`)
        .then((response) => {
          setData(response?.data?.departments);
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), { variant: "error" });
        })
        .finally(() => setLoading(false));
    } else {
      setData(initialData);
      setNumDepartments(initialNumData);
    }
  }, [keyword]);

  const onChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  const handlePage = (value) => {
    const page = value?.page + 1;
    setLoading(true);
    API.get(`${DEPARTMENT_ENDPOINTS.get}?page=${page}`)
      .then((response) => {
        setData(response.data?.departments);
      })
      .catch((error) => {
        enqueueSnackbar(getAxiosError(error), { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  const deleteDepartment = (id) => {
    confirmAlert({
      title: "Delete Department",
      message: "Are you sure you want to do this?",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            dispatch(showLoading());
            API.delete(`${DEPARTMENT_ENDPOINTS.delete}${id}`)
              .then(() => {
                enqueueSnackbar("Successfully deleted!", {
                  variant: "success",
                });
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

  const isUpdated = (newValue, oldValue) => {
    if (oldValue["name"] !== newValue["name"])
      return "name";
    if (oldValue["date_updated"] !== newValue["date_updated"]) return "date_updated";
    if (oldValue["description"] !== newValue["description"]) return "description";
    if (oldValue["date_added"] !== newValue["date_added"]) return "date_added";
    if (oldValue["company"] !== newValue["company"]) return "company";
    return null;
  };

  const editDepartment = useCallback(
    (newValue, oldValue) =>
      new Promise((resolve, reject) => {
        const edited = isUpdated(newValue, oldValue);
        if (edited) {
          const newData = {
            [edited]: newValue[edited],
            editor: currentUser?._id,
          };
          confirmAlert({
            title: `UPDATE Department`,
            message: `Are you sure you want to do this?`,
            closeOnClickOutside: false,
            buttons: [
              {
                label: "Confirm",
                onClick: () => {
                  dispatch(showLoading());
                  API.patch(
                    `${DEPARTMENT_ENDPOINTS.update}${oldValue?._id}`,
                    newData
                  )
                    .then(() => {
                      enqueueSnackbar("Successfully updated!", {
                        variant: "success",
                      });
                      resolve(newValue);
                    })
                    .catch((error) => {
                      enqueueSnackbar(getAxiosError(error), {
                        variant: "error",
                      });
                      resolve(oldValue);
                    })
                    .finally(() => {
                      dispatch(hideLoading());
                    });
                },
              },
              {
                label: "Cancel",
                onClick: () => {
                  resolve(oldValue);
                },
              },
            ],
          });
        } else {
          resolve(oldValue); // Nothing was changed
        }
      }),
    []
  );

  const generateQRCode = (id) => {
    QRCode.toDataURL(id, { width: 800, margin: 2 }, (err, url) => {
      if (err) return console.error(err);
      setQrCode(url);
    });

    if (qrCode)
      confirmAlert({
        title: `GENERATE QR CODE`,
        message: `Are you sure you want to do this?`,
        closeOnClickOutside: false,
        buttons: [
          {
            label: "Confirm",
            onClick: () => {
              dispatch(showLoading());
              API.patch(`${DEPARTMENT_ENDPOINTS.update}${id}`, {
                qrCode,
                editor: currentUser?._id,
              })
                .then(() => {
                  enqueueSnackbar("Successfully updated!", {
                    variant: "success",
                  });
                  // resolve(newValue);
                })
                .catch((error) => {
                  enqueueSnackbar(getAxiosError(error), {
                    variant: "error",
                  });
                  // resolve(oldValue);
                })
                .finally(() => {
                  dispatch(hideLoading());
                  setQrCode(null);
                });
            },
          },
          {
            label: "Cancel",
            onClick: () => {
              resolve(oldValue);
            },
          },
        ],
      });
  };

  const columns = [
    {
      field: "images",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      hideable: false,
      renderCell: (params) => (
        <Avatar
          alt="department"
          variant="rounded"
          sx={{ width: 64 }}
          src={API_URL + params.row?.images[0]}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      editable: isMasterUser(currentUser),
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      flex: 1,
      minWidth: 180,
      editable: isMasterUser(currentUser),
    },
    {
      field: "company",
      headerName: "Company",
      sortable: false,
      flex: 1,
      minWidth: 180,
      editable: isMasterUser(currentUser),
    },
    {
      field: "date_updated",
      headerName: "Date Updated",
      flex: 1,
      minWidth: 110,
      description: "This column is editable.",
      editable: false,
      renderCell: (params) =>
        params?.value ? (
          <a
            href={params?.value}
            download={`${params?.row?.make}_${params?.row?.model}.png`}
            className={`underline text-skin-inverted`}
          >
            Download
          </a>
        ) : (
          <button
            className="bg-skin-fill-inverted px-2 py-1 text-white rounded"
            onClick={() => generateQRCode(params?.row?._id)}
          >
            Generate
          </button>
        ),
    },
    {
      field: "date_added",
      headerName: "Date Added",
      flex: 1,
      minWidth: 120,
      description: "This column is editable.",
      editable: isMasterUser(currentUser),
      type: "singleSelect",
      valueOptions: DEPARTMENT_DATE_ADDED,
      renderCell: (params) => <p className="text-xs">{params?.value}</p>,
    },
    isMasterUser(currentUser) && {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MdDelete className={`text-lg text-red`} />}
          label="Delete"
          onClick={() => deleteDepartment(params?.id)}
        />,
      ],
    },
  ];

  return (
    <div className={``}>
      <h2 className={`text-2xl font-semibold`}>Departments</h2>
      {/* ============= searchbox and add button */}
      <div className={`mt-8 flex items-center justify-between`}>
        <input
          onChange={onChange}
          className={`h-12 w-96 rounded-full bg-skin-fill-base px-6 outline-none focus:border-skin-inverted ${handleDarkThemeStyling(
            currentTheme,
            "bg-custom-gradient-light text-white",
            " placeholder-color-gray"
          )}`}
          placeholder="Search by keyword..."
          type="search"
        />

        {isPermitted(currentUser) && (
          <button
            className={`h-11 w-32 rounded-xl bg-skin-fill-inverted text-white duration-300 ease-in-out hover:drop-shadow-2xl`}
            onClick={() => setShowModal(true)}
          >
            Add Department
          </button>
        )}
      </div>

      <div
        className={`mt-12 overflow-hidden rounded-3xl px-8 py-4 shadow-lg ${handleDarkThemeStyling(
          currentTheme,
          "bg-custom-gradient-light text-white",
          "bg-skin-fill"
        )}`}
      >
        <DataGrid
          autoHeight
          rows={data}
          rowCount={numDepartments}
          getRowId={(row) => row?._id}
          columns={columns}
          loading={loading}
          paginationMode="server"
          onPaginationModelChange={handlePage}
          rowHeight={60}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          className={`capitalize`}
          sx={dataGridStyle(currentTheme)}
          processRowUpdate={editdepartment}
        />
      </div>

      {showModal && (
        <ManageDepartment
          showModal={showModal}
          setShowModal={setShowModal}
          currentTheme={currentTheme}
          navigate={navigate}
          currentUser={currentUser}
        />
      )}

      {displayModal && (
        <ManageDepartmentImages
          displayModal={displayModal}
          setDisplayModal={setDisplayModal}
          currentTheme={currentTheme}
          currentUser={currentUser}
          navigate={navigate}
          Images={Images}
          Id={Id}
        />
      )}

    </div>
  );
};

export default Departments;
