import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { CgDanger } from "react-icons/cg";
// import { useNavigate } from 'react-router-dom';
import { pink } from "@mui/material/colors";

type Props = {};

const AllCourses = (props: Props) => {
  // const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});
  

  const rows: any = [];

  {
    data &&
      data.courses.forEach((item: any) => {
        rows.push({
          id: item._id,
          displayId: item.id,
          title: item.name,
          ratings: item.ratings,
          purchased: item.purchased,
          created_at: format(item.createdAt),
          realId: item._id
        });
      });
  }
  const columns: GridColDef[] = [
     {
      field: "actions",
      headerName: "",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-4">
            <Link href={`/admin/edit-course/${params.row.realId}`}>
              <FiEdit2 className="dark:text-white text-red" size={20} color='#3343a7'  />
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(!open);
                setCourseId(params.row.realId);
              }}
              aria-label="Delete course"
            >
              <GridDeleteIcon sx={{ color: pink[500] }} />
            </button>
          </div>
        );
      },
    },
    { field: "displayId", headerName: "ID", width: 90 },
    { field: "title", headerName: "Course Title", flex: 1, minWidth: 240 },
    { field: "ratings", headerName: "Ratings", width: 120 },
    { field: "purchased", headerName: "Purchased", width: 130 },
    { field: "created_at", headerName: "Created At", flex: 1, minWidth: 160 },
   
  
  ];

 

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error,refetch]);

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
   
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
    {isLoading ? (
      <Loader />
    ) : (
      <>
      {/* // <Box m="20px"> */}

<div className=''>
{/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
<h2 className="mb-3 text-[20px] font-poppins font-[600]">Live Courses</h2>
<DataGrid
  autoHeight
  columns={columns}
  rows={rows}
  pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
  sx={{
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "red",
      color: "#fff",
      fontSize: "1rem",
    },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "#f5f5f5",
    },
  }}
/>
{/* </ThemeProvider> */}
</div>


      
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
                Are you sure you want to delete this course?
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
        </>
    
    )}
  </div>
          
    
  );
};

export default AllCourses;
