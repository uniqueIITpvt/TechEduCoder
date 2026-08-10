import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { CgDanger } from "react-icons/cg";
import {
  useDeleteCourseEventMutation,
  useGetCourseAllEventsQuery,
} from "@/redux/features/course-Events/courseEventsApi";
import moment from "moment";
import { FaEdit } from "react-icons/fa";

import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import {   pink } from "@mui/material/colors";
import { IoMdEye } from "react-icons/io";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
type Props = {};

const CourseLiveEvents = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [EventsCourse, setEventsCourse] = useState([]);
  const [previewCourse, setPreviewCourse] = useState(false);
  const [deleteEvent, setDeleteEvent] = useState(" ");
  const { isLoading, data, refetch } = useGetCourseAllEventsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: courseData } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourseEvent, { isSuccess, error }] =
    useDeleteCourseEventMutation({});

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-3">
            <Link href={`/admin/edit-courseEvents/${params.row.realID}`}>
              <FaEdit size={20} />
            </Link>
            <button
              type="button"
              className="text-[#d55b45]"
              onClick={() => handlePreviewClick(params.row)}
              aria-label="Preview course"
            >
              <IoMdEye />
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(!open);
                setDeleteEvent(params.row.realID);
              }}
              aria-label="Delete event"
            >
              <GridDeleteIcon sx={{ color: pink[500] }} />
            </button>
          </div>
        );
      },
    },
    { field: "displayId", headerName: "ID", width: 90 },
    { field: "eventsName", headerName: "Events Name", flex: 1, minWidth: 180 },
    { field: "eventstype", headerName: "Events Type", flex: 1, minWidth: 150 },
    { field: "eventPercentage", headerName: "Event Percentage(%)", flex: 1, minWidth: 180 },
    { field: "course", headerName: "Number of course", flex: 1, minWidth: 170 },
    { field: "startDate", headerName: "Start Date", flex: 1, minWidth: 190 },
    { field: "endDate", headerName: "End Date", flex: 1, minWidth: 190 },
  ];

  const rows: any = [];

  {
    data &&
      data.courseEvent.forEach((item: any) => {
        rows.push({
          id: item._id,
          displayId: item.id,
          eventsName: item.eventsName,
          eventstype: item.eventsType,
          eventPercentage: item.eventPercentage,
          course: item.filteredCourseId.length,
          startDate: moment(item.startDate).format("MMMM Do YYYY, h:mm"),
          endDate: moment(item.endDate).format("MMMM Do YYYY, h:mm"),
          realID: item._id,
        });
      });
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("course Deleted Successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    const id = deleteEvent;
    await deleteCourseEvent(id);
  };

  const handlePreviewClick = (rowData: any) => {
    setPreviewCourse(!previewCourse);

    const previewEventsData =
      data && data.courseEvent.find((i: any) => i._id === rowData.realID);

    const eventCourses = previewEventsData.filteredCourseId
      .map((filteredId: any) => {
        return (
          courseData &&
          courseData.courses.find((c: any) => c._id === filteredId.courseId)
        );
      })
      .filter(Boolean);
    setEventsCourse(eventCourses);
  };
  
  return (
    <div className="mt-[50px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="w-full pt-1 mt-1 bg-white">
            <h2 className="mb-3 text-[20px] font-poppins font-[600]">
              Live course Events
            </h2>
            <DataGrid
              autoHeight
              columns={columns}
              rows={rows}
              pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
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
          </div>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <div className=" flex items-center justify-center">
                  <CgDanger className="text-red-400" size={45} />
                </div>
                <div className="flex items-center justify-center p-8">
                  <h1 className={`${styles.label} !items-center`}>
                    Are you sure you want to delete this courseEvent?
                  </h1>
                </div>
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

          {previewCourse && (
            <Modal
              open={previewCourse}
              onClose={() => setPreviewCourse(!previewCourse)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow  outline-none">
              
               <div>
                <div className="flex bg-red-600 p-4 text-white ">
                <h1 className="text-[18px] font-[500] mr-[1rem]  font-poppins">ID</h1>
                <h1  className="text-[18px] font-[500] mr-[1rem] font-poppins " >Course Name</h1>
                </div>

               {EventsCourse &&
                    EventsCourse.map((item:any, index:any) => (
                <div  key={index.id}  className="flex p-4">
                  
                  <p className="mr-[1rem] font-[17px]">{item.id}</p>
                  <p className=" mr-[1rem] font-[500]  border-b-2 text-[17px] shadow-sm  ">
                      {item.name}
                    </p>
                   
                </div>

                      
                    
              
                     
                    ))}
               </div>
           
               
               
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default CourseLiveEvents;
