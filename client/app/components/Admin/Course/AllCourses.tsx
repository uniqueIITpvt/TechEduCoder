import React, { useEffect, useState } from "react";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { Button , Box , Modal, makeStyles } from '@material-ui/core';
import { AiOutlineDelete } from "react-icons/ai";
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
import MaterialTable from '@material-table/core';
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
          id: item.id,
          title: item.name,
          ratings: item.ratings,
          purchased: item.purchased,
          created_at: format(item.createdAt),
          realId: item._id
        });
      });
  }
  const actions = [
   
    {
      icon: () => <GridDeleteIcon sx={{ color: pink[500] }} />,
      tooltip: 'Delete Course',
      onClick: (event:any, rowData:any) => {
        setOpen(!open);
        setCourseId(rowData.realId);
       
      },
      iconProps: {
        style: {
          margin: '0 2rem 0 2rem', // Add margin around the icon
        }
      }
    },
  ];



  const columns = [
     {
      field: "  ",
    
    
      render: (params: any) => {
        return (
          <>
            <Link href={`/admin/edit-course/${params.realId}`}>
              <FiEdit2 className="dark:text-white text-red" size={20} color='#3343a7'  />
            </Link>
          </>
        );
      },
    },
    { field: "id", title: "ID",  width: '10%' },
   
    // {
    //   field: " ",
    //   title: "Delete",
      
    //   render: (params: any) => {
    //     return (
    //       <>
    //         <Button
    //           onClick={() => {
    //             setOpen(!open);
    //             setCourseId(params.realId);
    //           }}
    //         >
    //           <AiOutlineDelete
    //             className="dark:text-white text-black"
    //             size={20}
    //           />
    //         </Button>
    //       </>
    //     );
    //   },
    // },
    { field: "title", title: "Course Title", width: '50%' },
    { field: "ratings", title: "Ratings",width: '10%'  },
    { field: "purchased", title: "Purchased",width: '5%' },
    { field: "created_at", title: "Created At", width: '10%' },
   
  
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
<MaterialTable
title="Live Courses"
actions={actions}
columns={columns}

data={rows
}


options={{
sorting: true,
search: true,
searchFieldAlignment: 'right',
searchAutoFocus: true,
searchFieldVariant: 'standard',
// filtering: true,
paging: true,
pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
pageSize: 10,
paginationType: 'stepped',
showFirstLastPageButtons: false,
paginationPosition: 'both',
// exportButton: true,
exportAllData: true,
// exportFileName: 'Abo_Hala_AllCoupons ',
addRowPosition: 'first',
grouping: true,
columnsButton: true,
// rowStyle: {
//   backgroundColor: '#EEE',
// }
rowStyle: (data: any, index: any) =>
  index % 2 === 0 ? { background: '#f5f5f5' } : {},
headerStyle: { background: 'red', color: '#fff', fontSize: '1rem', padding: '1rem'},



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
