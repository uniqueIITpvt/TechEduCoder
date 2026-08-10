import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineMail } from "react-icons/ai";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { CgDanger } from "react-icons/cg";
import { MdDelete } from "react-icons/md";

type Props = {
  isTeam?: boolean;
};

const AllCourses: FC<Props> = ({ isTeam }) => {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [updateError, isSuccess, deleteSuccess, deleteError]);

  const columns: GridColDef[] = [
    {
      field: "mail",
      headerName: "Email",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
            <Link href={`mailto:${params.row.email}`}>
              <AiOutlineMail
               className=" ml-5 "  size={20} />
            </Link>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
            <Button
              onClick={() => {
                setOpen(!open);
                setUserId(params.row.id);
              }}
            >
              <MdDelete 
                  className="dark:text-red-700 text-red-700"
                //  sx={{ color: red[500] }}
                size={20}
              />
            </Button>
        );
      },
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    { field: "role", headerName: "Role", width: 130 },
    { field: "courses", headerName: "Purchased Courses", width: 180 },
    { field: "created_at", headerName: "Joined At", flex: 1, minWidth: 160 },
   
 

  ];

  const rows: any = [];

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          email: item.email,
          name: item.name,
        
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  }

  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          {isTeam && (
            <div className="w-full flex justify-end">
              <div
                className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </div>
            </div>
          )}
          <Box
            m="40px 0 0 0"
         
          >
        <div className='w-full pt-1 mt-1 bg-white'>
{/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
<h2 className="mb-3 text-[20px] font-poppins font-[600]">All Users</h2>
<DataGrid
  autoHeight
  columns={columns}
// [
//   { title: 'Name', field: 'name' },
//   { title: 'Surname', field: 'surname' },
//   { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
//   {
//     title: 'Birth Place',
//     field: 'birthCity',
//     lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
//   },
// ]
  rows={rows}
// [
//   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
//   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
// ]




  pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
  sx={{
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "red",
      color: "#fff",
      fontSize: "17px",
    },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "#f5f5f5",
    },
  }}
// components={{
// Toolbar: (props) => (
//  <MTableToolbar {...props} /> // Add Material Table toolbar
// ),
// }}
// options={{
//   rowStyle: {
//     backgroundColor: '#EEE',
//   }
// }}
/>
{/* </ThemeProvider> */}
</div>
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} !mt-6`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </div>
              </Box>
            </Modal>
          )}

{open && (
          <Modal
            open={open}
            onClose={() => setOpen(!open)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
              <div className=" flex items-center justify-center">< CgDanger className="text-red-400"  size={45} /></div>
              <div className="flex items-center justify-center p-8"><h1 className={`${styles.label} !items-center`}>
                Are you sure you want to delete this users?
              </h1></div>
           <div className="flex items-center justify-center">
           <div className="flex w-[70%] items-center justify-between mb-6  ">
                <div
                  className={`${styles.button} !w-auto h-[30px] bg-[#47d097] cursor-pointer`}
                  onClick={() => setOpen(!open)}
                >
                  Cancel
                </div>
                <div
                  className={`  inline-flex items-center  justify-center md:justify-start px-5 py-4 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full md:w-fit hover:text-gradient-to-r from-blue-500 to-[#521088]"!w-[120px] h-[30px] !bg-[#d63f3f] cursor-pointer`}
                  onClick={handleDelete}
                >
                  Delete
                </div>
              </div>
           </div>
            </Box>
          </Modal>
        )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
