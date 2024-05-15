import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./EbookDetails";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import EbookDetails from "./EbookDetails";
import { useGetEbookQuery } from "@/redux/features/ebook/ebooksApi";

type Props = {
  id: string;
};

const EbookDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  // const { data, isLoading } = useGetCourseDetailsQuery(id);
  // const { data: config } = useGetStripePublishablekeyQuery({});


  const { data, isLoading } = useGetEbookQuery(id);
 
  const { data: userData } = useLoadUserQuery(undefined, {});



 

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.ebook.ebookTitle + " - UniqueIIT "}
            description={
              "ELearning is a programming community which is developed by Musharraf hussain for helping programmers"
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
