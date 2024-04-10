"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import Events from "../components/Route/events";
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


  


  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
         <Heading
              title={"All courses -uniqueiit "}
              description={"Elearning is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          < Events />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;