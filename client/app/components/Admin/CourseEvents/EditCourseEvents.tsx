import React, { useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";
import moment from "moment";
import {
  useEditCourseEventMutation,
  useGetCourseAllEventsQuery,
} from "@/redux/features/course-Events/courseEventsApi";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { MdAddBox } from "react-icons/md";
type Props = {
  id: any;
};

const EditCourseEvents = ({ id }: Props) => {
  const { isLoading, data, refetch } = useGetCourseAllEventsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: courseData } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [editCourse, { isSuccess, error }] = useEditCourseEventMutation();
  const [eventsStartDate, setEventsStartDate] = useState(" ");
  const [eventsEndDate, setEventsEndDate] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [eventsInfo, setEventsInfo] = useState({
    eventPercentage: "",
    eventsType: "",
    id: "",
    eventsName: "",
  });





  const editEventsData =
    data && data.courseEvent.find((i: any) => i._id === id);

  useEffect( ()=> {
if(editEventsData){
  setEventsInfo({
    eventPercentage:editEventsData.eventPercentage,
    eventsType:editEventsData.eventsType,
    id: editEventsData.id,
    eventsName: editEventsData.eventsName,

  });
  setEventsStartDate(moment(editEventsData.startDate).utc().format("YYYY-MM-DD HH:mm"));
  setEventsEndDate(moment(editEventsData.endDate).utc().format("YYYY-MM-DD HH:mm"));
}


  const eventCourses = editEventsData.filteredCourseId.map(
    (filteredId: any) => {
      return (
        courseData &&
        courseData.courses.find((c: any) => c._id === filteredId.courseId)
      );
    }
  ).filter(Boolean);;

  setEvents(eventCourses);



  }, [editEventsData])
  


 

  const handleEditEvents = async (selectedRows: any) => {
    const filteredCourseId = selectedRows.map((row: any) => ({
      courseId: row.realId,
    }));

    const data = {
      filteredCourseId,
      eventPercentage: parseInt(eventsInfo.eventPercentage, 10),
      eventsType: eventsInfo.eventsType,
      id: eventsInfo.id,
      eventsName: eventsInfo.eventsName,
      startDate: eventsStartDate,
      endDate: eventsEndDate,
    };

    await editCourse(  {id:editEventsData._id ,data} );
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course event update  successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const rows: any = [];
  {
    events &&
      events.forEach((item: any) => {
        rows.push({
          id: item._id,
          displayId: item.id,
          title: item.name,

          categories: item.categories,
          created_at: format(item.createdAt),
          isEvent: item.isEvent,
          realId: item._id,
        
        });
      });
  }

  const columns: GridColDef[] = [
    { field: "displayId", headerName: "ID", width: 90 },
    { field: "title", headerName: "Course Title", flex: 1, minWidth: 220 },
    { field: "categories", headerName: "Categories", flex: 1, minWidth: 160 },
    { field: "created_at", headerName: "Created At", flex: 1, minWidth: 160 },
    { field: "isEvent", headerName: "Running Events", flex: 1, minWidth: 150 },
  ];

  const handleEventStartDateChange = (e: any) => {
    const eventsStartdate = new Date(e.target.value);
    const format = moment(eventsStartdate).utc().format("YYYY-MM-DD HH:mm");
    setEventsStartDate(format);
  };

  const handleEventEndDateChange = (e: any) => {
    const eventsEnddate = new Date(e.target.value);
    const format = moment(eventsEnddate).utc().format("YYYY-MM-DD HH:mm");
    setEventsEndDate(format);
  };
 
  return (
    <div className="mt-[48px] m-6">
      <div>
        <div>
          <h1 className="text-[26px] font-poppins font-[600]">Edit Events</h1>
        </div>

        <div className="grid grid-cols-1 md:grid md:grid-cols-6  gap-2 m-4">
          <div className="mb-4">
            <label className="block pb-2">
              Id <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="courseTitle"
              value={eventsInfo.id}
              onChange={(e: any) =>
                setEventsInfo({ ...eventsInfo, id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your event product name..."
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2">
              Events Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="courseTitle"
              value={eventsInfo.eventsName}
              onChange={(e: any) =>
                setEventsInfo({ ...eventsInfo, eventsName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your events name..."
            />
          </div>

          <div className="mb-4">
            <label className="block pb-2">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={eventsInfo.eventsType}
              onChange={(e: any) =>
                setEventsInfo({ ...eventsInfo, eventsType: e.target.value })
              }
            >
              <option value="Choose a category">Select a Event Type</option>

              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block pb-2">
              Event Percentage <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={eventsInfo.eventPercentage}
              onChange={(e: any) =>
                setEventsInfo({
                  ...eventsInfo,
                  eventPercentage: e.target.value,
                })
              }
            >
              <option value="Choose a category">Select a Percentage</option>
              <option value="5">5%</option>
              <option value="10">10%</option> <option value="15">15%</option>{" "}
              <option value="20">20%</option> <option value="25">25%</option>{" "}
              <option value="30">30%</option> <option value="35">35%</option>{" "}
              <option value="40">40%</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block pb-2">
              Event start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="start-date"
              value={eventsStartDate}
              // min={moment.utc().format("YYYY-MM-DDTHH:mm")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onChange={handleEventStartDateChange}
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2">
              Event End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="end-date"
              value={eventsEndDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onChange={handleEventEndDateChange}
              placeholder="Enter your event product stock..."
            />
          </div>
        </div>

        <div className="w-full pt-1 mt-1 bg-white">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[20px] font-poppins font-[600]">Select Rows</h2>
            <Button
              startIcon={<MdAddBox />}
              disabled={selectedRows.length === 0}
              onClick={() => handleEditEvents(selectedRows)}
              sx={{ color: "green" }}
            >
              Set
            </Button>
          </div>
          <DataGrid
            autoHeight
            columns={columns}
            rows={rows}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selection: GridRowSelectionModel) => {
              setSelectedRows(rows.filter((row: any) => selection.includes(row.id)));
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "red",
                color: "#fff",
                fontSize: "1.1rem",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCourseEvents;
