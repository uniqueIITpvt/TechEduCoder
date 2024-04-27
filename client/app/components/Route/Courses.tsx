import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { styles } from "@/app/styles/style";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import Link from "next/link";
type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const filteredCourses = data?.courses.filter(
        (course: any) => !course.isEvent
      );
      // console.log(filteredCourses);
      setCourses(filteredCourses);
    }
  }, [data]);

  return (
    <div className="pb-10 lg:mt-[100px]">
      <div className=" w-full relative ">
        <h1
          className={`${styles.title} 800px:!text-[45px] text-gradient pt-10`}
        >
          Our Feature Courses
        </h1>
        <h2 className="800px:!text-[20px] text-[18px] text-black dark:text-white font-[500] font-Poppins text-center py-2 mx-5 opacity-90">
          Learning often happens in classrooms but it doesn’t have to. Use
          Eduflow to facilitate learning experiences no matter the context.
        </h2>
        <br />
        <div className="grid grid-cols-1 justify-start items-center gap-5  mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:p-1 md:p-0 md:justify-start md:items-start md:mx-20 md:gap-5 p-10">
          {courses &&
            courses.slice(0, 4).map((item, index) => {
              // This assumes you want to do something with the isEvent property
              // For example, setting state (though setting state in a map like this can be problematic)
              // setEvent(item.isEvent); // Be cautious with setting state inside a map function

              // Directly return the CourseCard component if isEvent is false
              // Adjust this condition based on your actual requirement

              return <CourseCard item={item} key={index} />;

              // If you don't want to render anything for items where isEvent is true,
              // you must return null or undefined
            })}
        </div>
        {courses.length > 3 && (
          <Link
            href={`/courses`}
            className="absolute bottom-40 z-9999 right-10 hover:translate-x hover:translate-x-1 transition duration-300 hidden md:inline-block"
          >
            <IoIosArrowDroprightCircle size={50} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Courses;
