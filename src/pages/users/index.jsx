import { useCallback, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import {
  API,
  API_URL,
  USER_ENDPOINTS,
  dataGridStyle,
  getAxiosError,
  handleDarkThemeStyling,
  isMasterUser,
  isPermitted,
} from "../../helpers/constants";

import { Avatar } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import AddUser from "./addUser";

const Admins = () => {
  const loaderData = useLoaderData();
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("security");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numUsers, setNumUsers] = useState(loaderData?.numUsers || 0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.value);
  const currentUser = useSelector((state) => state.user.value);
  const [data, setData] = useState(() => {
    const temp = loaderData?.users?.filter(
      (user) => user?._id !== currentUser?._id
    );
    return temp || [];
  });

  useEffect(() => {
    dispatch(showLoading());
    API.get(USER_ENDPOINTS.get + `?type=${type}`)
      .then((response) => {
        const tempData = response.data?.users?.filter(
          (user) => user?._id !== currentUser?._id
        );
        setData(tempData);
        setNumUsers(response.data?.numUsers);
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
    if (keyword?.length && keyword?.length > 3) {
      setLoading(true);
      API.get(`${USER_ENDPOINTS.get}?keyword=${keyword}&type=${type}`)
        .then((response) => {
          const tempData = response.data?.users?.filter(
            (user) => user?._id !== currentUser?._id
          );
          setData(tempData);
        })
        .catch((error) => {
          enqueueSnackbar(getAxiosError(error), { variant: "error" });
        })
        .finally(() => setLoading(false));
    }
  }, [keyword]);

  const onChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  const handlePage = (value) => {
    const page = value?.page + 1;
    setLoading(true);
    API.get(`${USER_ENDPOINTS.get}?page=${page}&${type}`)
      .then((response) => {
        const tempData = response.data?.users?.filter(
          (user) => user?._id !== currentUser?._id
        );
        setData(tempData);
      })
      .catch((error) => {
        enqueueSnackbar(getAxiosError(error), { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  const deleteUser = (id) => {
    confirmAlert({
      title: "Delete Admin",
      message: "Are you sure you want to do this?",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            dispatch(showLoading());
            API.delete(`${USER_ENDPOINTS.delete}${id}`)
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

  const editUser = useCallback(
    (value, oldValue) =>
      new Promise((resolve, reject) => {
        const { _id, status, permission, firstName, lastName } = value;
        if (
          value &&
          (status !== oldValue?.status || permission !== oldValue?.permission)
        ) {
          confirmAlert({
            title: `UPDATE ${firstName?.toUpperCase()} ${lastName?.toUpperCase()}`,
            message: `Are you sure you want to do this?`,
            closeOnClickOutside: false,
            buttons: [
              {
                label: "Confirm",
                onClick: () => {
                  dispatch(showLoading());
                  API.patch(`${USER_ENDPOINTS.update}${_id}`, {
                    status,
                    permission,
                  })
                    .then(() => {
                      enqueueSnackbar("Successfully updated!", {
                        variant: "success",
                      });
                      resolve(value);
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

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 90,
      renderCell: (params) => <Avatar src={API_URL + params.row.image} />,
      sortable: false,
      filterable: false,
      hideable: false,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      fontWeight: "bold",
      flex: 1,
      minWidth: 180,
      editable: false,
      valueGetter: (params) => {
        return `${params.row.firstName || ""} ${params.row.lastName || ""}`;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 180,
      editable: false,
      renderCell: (params) => <p className="lowercase">{params?.value}</p>,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      sortable: false,
      flex: 1,
      minWidth: 180,
      editable: false,
    },
    {
      field: "employeeID_CODE",
      headerName: "Employee ID / CODE",
      sortable: false,
      flex: 1,
      minWidth: 180,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 110,
      description: "This column is editable.",
      editable: isMasterUser(currentUser),
      type: "singleSelect",
      valueOptions: isMasterUser(currentUser) && [
        "ACTIVE",
        "BLOCKED",
        "PENDING",
      ],
      renderCell: (params) => <p className="text-xs">{params?.value}</p>,
    },
    {
      field: "permission",
      headerName: "Permission",
      flex: 1,
      minWidth: 120,
      description: "This column is editable.",
      editable: isMasterUser(currentUser),
      type: "singleSelect",
      valueOptions: ["READ-ONLY", "READ-WRITE", "FULL-ACCESS"],
      renderCell: (params) => <p className="text-xs">{params?.value}</p>,
    },
    isMasterUser(currentUser) && {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MdDelete className={`text-lg text-red`} />}
          label="Delete"
          onClick={() => deleteUser(params?.id)}
        />,
      ],
    },
  ];

  return (
    <div className={``}>
      <h2 className={`text-2xl font-semibold`}>Users</h2>
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
            Add User
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
          rowCount={numUsers}
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
          processRowUpdate={editUser}
        />
      </div>

      {showModal && (
        <AddUser
          showModal={showModal}
          setShowModal={setShowModal}
          currentTheme={currentTheme}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default Admins;
