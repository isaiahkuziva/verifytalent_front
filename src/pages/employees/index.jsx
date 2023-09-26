import { useCallback, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


import {
    API,
    API_URL,
    EMPLOYEE_ENDPOINTS,
    dataGridStyle,
    getAxiosError,
    handleDarkThemeStyling,
    isMasterUser,
    isPermitted
} from "../../helpers/constants";

import { Avatar } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";

const Admins = () => {

  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [keyword, setKeyword] = useState("");
  const [color, setColor] = useState("red");
  const [loading, setLoading] = useState(false);
  const [numEmployees, setNumEmployees] = useState(loaderData?.numEmployees || 0);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.value);
  const currentUser = useSelector((state) => state.user.value);

  const [data, setData] = useState(() => {
    const temp = loaderData?.Employees || [];
    return temp;
  });


  useEffect(() => {
    dispatch(showLoading());
    API.get(EMPLOYEE_ENDPOINTS.get)
      .then((response) => {
        setData(response.data?.Employees);
        setNumEmployees(response.data?.numEmployees);
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
      API.get(`${EMPLOYEE_ENDPOINTS.get}?keyword=${keyword}&color=${color}`)
        .then((response) => {
          setData(response.data?.Employees);
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
    API.get(`${EMPLOYEE_ENDPOINTS.get}?page=${page}&${color}`)
      .then((response) => {
        setData(response.data?.Employees);
      })
      .catch((error) => {
        enqueueSnackbar(getAxiosError(error), { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  const deleteEmployee = (id) => {
    confirmAlert({
      title: "Delete Admin",
      message: "Are you sure you want to do this?",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            dispatch(showLoading());
            API.delete(`${EMPLOYEE_ENDPOINTS.delete}${id}`)
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


  const handleAddEmployeeClick = () => {
    navigate('/addEmployee');
  };
  


  const editEmployee = useCallback(
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
                  API.patch(`${EMPLOYEE_ENDPOINTS.update}${_id}`, {
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
      field: "images",
      headerName: "",
      width: 90,
      renderCell: (params) => {
        const firstImage = params.row.images[0];

        if (firstImage) {
          const imageUrl = API_URL + firstImage.preview;
          return <Avatar src={imageUrl} />;
        } else {
          return null;
        }
      },
      sortable: false,
      filterable: false,
      hideable: false,
    },


    {
      field: "firstName",
      headerName: "FirstName",
      fontWeight: "bold",
      flex: 1,
      minWidth: 180,
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 180,
      editable: false,
    },
   
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 180,
      editable: false,
    },

    {
      field: "contact",
      headerName: "Contact",
      flex: 1,
      minWidth: 180,
      editable: false,
    },
  
  // {
  //   field: "editor",
  //   headerName: "Editor",
  //   flex: 1,
  //   minWidth: 180,
  //   editable: false,
  //   valueGetter: async (params) => {
  //     try {
  //       const item = data.find(item => item.editor === params.value);

  //       if (!item) {
  //         return "N/A"; 
  //       }
  //       const editorData = await API.get(`${USER_ENDPOINTS.get}/${params.value}`);
  //       const editorInfo = editorData.data;
  //       return `${editorInfo.firstName} ${editorInfo.lastName}`;
  //     } catch (error) {
  //       console.error("Error fetching editor's username:", error);
  //       return "N/A";
  //     }
  //   },
  // },
    {
      field: "middleName",
      headerName: "MiddleName",
      flex: 1,
      minWidth: 180,
      editable: false,
    },
    {
      field: "lastName",
      headerName: "lastName",
      sortable: false,
      flex: 1,
      minWidth: 180,
      editable: false,
    },
    isMasterUser(currentUser) && {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MdDelete className={`text-lg text-red`} />}
          label="Delete"
          onClick={() => deleteEmployee(params?.id)}
        />,
      ],
    },
  ]; 


  return (
    <div className={``}>
      <h2 className={`text-2xl font-semibold`}>Employees</h2>
      {/* ============= searchbox and add button */}
      <div className={`mt-8 flex items-center justify-between`}>
        <input
          value={keyword}
          onChange={onChange}
          className={`h-12 w-96 rounded-full bg-skin-fill-base px-6 outline-none focus:border-skin-inverted ${handleDarkThemeStyling(
            currentTheme,
            "bg-custom-gradient-light text-white",
            " placeholder-color-gray"
          )}`}
          placeholder="Search by keyword..."
        />

        {isPermitted(currentUser) && (
          <button
            className={`h-11 w-32 rounded-xl bg-skin-fill-inverted text-white duration-300 ease-in-out hover:drop-shadow-2xl`}
            onClick={handleAddEmployeeClick}
          >
            Add Employee
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
          rowCount={numEmployees}
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
          processRowUpdate={editEmployee}
        />
      </div>


    </div>
  );
};

export default Admins;
