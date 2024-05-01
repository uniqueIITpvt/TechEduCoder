"use client";
import React, { FC,  useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import Blogs from "./components/Route/Blogs";
import Book from "../app/components/Route/Book";
import Events from "./components/Route/events";

interface Props {

}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");


  return (
    <>
      <Heading
        title="uniqueiit lms "
        description="uniqueiit lms is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses />
      <Book/>
      <Blogs/>
      <br />
      <br />
      <br />
      <Events/>
      <FAQ inPage={false} />
      <Footer />
    </>
  );
};

export default Page;
