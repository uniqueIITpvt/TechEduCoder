import React, { useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";

import { format } from "timeago.js";

import { toast } from "react-hot-toast";
import MaterialTable from "@material-table/core";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import moment from "moment";
import { useCreateCourseEventsMutation } from "@/redux/features/course-Events/courseEventsApi";
import { Button } from "@mui/material";
import { MdAddBox } from "react-icons/md";
type Props = {};

const CourseCreateEvents = (props: Props) => {
  const [courseTitle, setCourseTitle] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [createCourseEvents, { isSuccess, error }] =
    useCreateCourseEventsMutation();
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [category, setCategory] = useState("");
  const categories = categoriesData?.layout.categories;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventsStartDate, setEventsStartDate] = useState(" ");
  const [eventsEndDate, setEventsEndDate] = useState("");

  const handleStartDateChange = (e: any) => {
    const startDate = new Date(e.target.value);
    const format = moment(startDate).format("YYYY-MM-DD");
    setStartDate(format);
  };

  const handleEndDateChange = (e: any) => {
    const selectedDate = new Date(e.target.value);
    const format = moment(selectedDate).format("YYYY-MM-DD");
    setEndDate(format);
  };

  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    if (data && data.courses) {
      setCourseData(data.courses);
    }
  }, [data]);

  const filterCourse = (
    title: any,
    category: any,
    startDate: any,
    endDate: any
  ) => {
    return courseData.filter(({ name, categories, createdAt }) => {
      return (
        name === title ||
        categories === category ||
        (moment(createdAt).format("YYYY-MM-DD") >=
          moment(startDate).format("YYYY-MM-DD") &&
          moment(createdAt).format("YYYY-MM-DD") <=
            moment(endDate).format("YYYY-MM-DD")) ||
        (categories === category &&
          moment(createdAt).format("YYYY-MM-DD") >=
            moment(startDate).format("YYYY-MM-DD") &&
          moment(createdAt).format("YYYY-MM-DD") <=
            moment(endDate).format("YYYY-MM-DD"))
      );
    });
  };

  const filterCourseData = filterCourse(
    courseTitle,
    category,
    startDate,
    endDate
  );

  const handleCreateEvents = async (selectedRows: any) => {
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

    await createCourseEvents(data);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course event created successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("event created su");
    }
  }, []);
  const rows: any = [];
  {
    filterCourseData &&
      filterCourseData.forEach((item: any) => {
        rows.push({
          id: item.id,
          title: item.name,

          categories: item.categories,
          created_at: format(item.createdAt),
          isEvent: item.isEvent,
          realId: item._id,
        });
      });
  }

  const columns = [
    { field: "id", title: "ID", 
   
  },
    { field: "title", title: "Course Title" },
    { field: "categories", title: "Categories" },
    { field: "created_at", title: "Created At" },
    { field: "isEvent", title: "Runnig Events" },
  ];

  const reset = () => {
    setCategory("");
    setEndDate("");
    setStartDate("");
    setCourseTitle("");
  };

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
  const [eventsInfo, setEventsInfo] = useState({
    eventPercentage: "",
    eventsType: "",
    id: "",
    eventsName: "",
  });
  const CustomAddIcon = () => {
    return (
      <Button
        startIcon={<MdAddBox />}
        style={{
          color: 'green', // Example styling
          // Add more styles here
        }}
      >
        Set
      </Button>
    );
  };

  return (
    <div className="mt-[48px] m-6">
      <div>
        <div>
          <h1 className="text-[26px] font-poppins font-[600]">Filter Course</h1>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3  ">
            <div className="mb-4">
              <label className="block pb-2">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="courseTitle"
                value={courseTitle}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Enter your event product name..."
              />
            </div>
            <div className="mb-4">
              <label className="block pb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Choose a category">Select a Category</option>
                {categories &&
                  categories.map((i: any) => (
                    <option value={i.title} key={i.title}>
                      {i.title}
                    </option>
                  ))}
              </select>
            </div>
            {/* Event Start and End Dates */}

            <div className="mb-4">
              <label className="block pb-2">
                Date from <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
             
                id="start-date"
                value={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleStartDateChange}
                placeholder="Enter your event product stock..."
              />
            </div>

            <div className="mb-4">
              <label className="block pb-2">
                 Date To <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
          
                id="end-date"
                value={endDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleEndDateChange}
                placeholder="Enter your event product stock..."
              />
            </div>
            <div
              className=" w-full px-3 py-2 h-[3rem] mt-7 bg-gradient-to-r inline-flex items-center  justify-center md:justify-start  text-[17px] font-[500] text-center text-white rounded-md cursor-pointer    dark:hover:bg-blue-700 dark:focus:ring-blue-800  md:w-fit hover:text-gradient-to-r from-blue-500 to-[#521088] hover:bg-gradient-to-br hover:text-white transition-all ease-in-out delay-150  hover:-translate-y hover:scale-60 hover:bg-indigo-500 duration-300"
              onClick={reset}
            >
              Reset
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-[26px] font-poppins font-[600]">Set Events</h1>
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
              Event  start Date <span className="text-red-500">*</span>
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
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
          <MaterialTable
            title="Select Rows"
            columns={columns}
            data={rows}
            options={{
              selection: true,
              search: false,
              rowStyle: (data: any, index: any) =>
                index % 2 === 0 ? { background: "#f5f5f5" } : {},
              headerStyle: {
                background: "red",
                color: "#fff",
                fontSize: "1.2rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
              },
            }}
            actions={[
              {
                tooltip: "Set Event",
                icon: () => <CustomAddIcon />,
                onClick: (evt, data) => handleCreateEvents(data),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCreateEvents;
