"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setcourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setcourses(data?.courses);
    }
    if (category !== "All") {
      setcourses(
        data?.courses.filter((item: any) => item.categories === category)
      );
    }
   
  }, [data, category, search]);

  const categories = categoriesData?.layout.categories;


  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses -uniqueiit "}
              description={"online  is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`${
                  category === "All" ? "bg-gradient-to-r from-blue-500 to-[#521088] text-white" : "bg-white  text-black opacity-80 "
                }  m-1   rounded-full flex items-center justify-center font-Poppins p-2 px-3 cursor-pointer text-[16px] font-[500] hover:bg-gradient-to-r from-blue-500 to-[#521088] hover:text-white`}
                onClick={() => setCategory("All")}
              >
             All Courses
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`${
                        category === item.title
                          ? "bg-gradient-to-r from-blue-500 to-[#521088] text-white"
                          : " text-black"
                        } m-1   rounded-full flex items-center justify-center font-Poppins p-2 px-3 cursor-pointer text-[16px] font-[500] hover:bg-gradient-to-r from-blue-500 to-[#521088] hover:text-white opacity-80`}

                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
          
            <br />
            <br />
            <div className="grid grid-cols-1 p-5 gap-[20px] lg:grid-cols-3 lg:grid md:grid-cols-2 md:gap-[25px]  lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
        </>
      )}
    </div>
  );
};

export default Page;
