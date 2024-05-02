"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Footer from "../components/Footer";
import EbookCard from "../components/EbookCard/EbookCard";
import Book from "./Book";

type Props = {};
const Page = (props: Props) => {
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(2);
  const [open, setOpen] = useState(false);
  const [ebooks, setEbooks] = useState<any[]>([]);

  return (
    <>
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        activeItem={activeItem}
        setOpen={setOpen}
      />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <Heading
          title={"All courses - Elearning"}
          description={"Elearning is a programming community."}
          keywords={
            "programming community, coding skills, expert insights, collaboration, growth"
          }
        />
      </div>
      <Book />

      <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
    </>
  );
};

export default Page;
