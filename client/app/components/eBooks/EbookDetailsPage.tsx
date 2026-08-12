import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import EbookDetails from "./EbookDetails";
import { useGetEbookQuery } from "@/redux/features/ebook/ebooksApi";

type Props = {
  id: string;
};

const EbookDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  
 const { data, isLoading, isError } = useGetEbookQuery(id);
 
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError || !data?.ebook ? (
        <div className="min-h-screen flex items-center justify-center dark:text-white text-black">
          Ebook could not be found.
        </div>
      ) : (
        <div>
          <Heading
            title={data.ebook.ebookTitle + " - TechEduCoder "}
            description={
              " TeachEduCoder is a programming community which is developed by Musharraf hussain for helping programmers"
            }
            keywords={data?.ebook?.level}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={2}
          />
          
       
            <EbookDetails
              data={data.ebook}
              setRoute={setRoute}
              setOpen={setOpen}
            />
    
           <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
        </div>
      )}
    </>
  );
};

export default EbookDetailsPage;
