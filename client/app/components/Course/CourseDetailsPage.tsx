import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";


declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.course.name + " - UniqueIIT "}
            description={
              "TechEduC0der is a programming community which is developed by Musharraf hussain for helping programmers"
            }
            keywords={data?.course?.tags}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />

          <CourseDetails
            data={data.course}
            setRoute={setRoute}
            setOpen={setOpen}
          />

          <Footer
            open={open}
            setOpen={setOpen}
            setRoute={setRoute}
            route={route}
          />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
