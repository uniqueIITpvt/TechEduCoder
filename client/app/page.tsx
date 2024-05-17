"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import Blogs from "./components/Route/Blogs";
import Book from "../app/components/Route/Book";
import Events from "./components/Route/events";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  

  return (
    <>
      <Heading
        title="techeducoder.com "
        description="techeducoder is a platform for tain student in latest technology  in web development app development devOps"
        keywords=" programing ,MERN,Redux,Machine Learning , AI , devOps"
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
      <Book />
      <Blogs />
      <br />
      <br />
      <br />
      <Events />
      <FAQ inPage={false} />
      <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />

    </>
  );
};

export default Page;
