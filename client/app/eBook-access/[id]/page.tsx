"use client"
import React, { useEffect, useState } from "react";

import Heading from "@/app/utils/Heading";

import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

import { useGetEbookContentQuery } from "@/redux/features/ebook/ebooksApi";
import Loader from "../../components/Loader/Loader";
import Header from "../../components/Header";
import EbookDetails from "../../components/eBooks/EbookDetails";
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const  ShowEbook= dynamic(()=>import("../../components/eBooks/ShowEbook" ),{  ssr: false,} )



type Props = {

};

const Page = ({params}:any) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const id = params.id

  

  const { data, isLoading, error } = useGetEbookContentQuery(id);

  const { data: userData } = useLoadUserQuery(undefined, {});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");


 
 

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error || !data?.ebook ? (
        redirect("/")
      ) : (
        <div>
          <Heading
            title={data.ebook.ebookTitle + " - UniqueIIT "}
            description={
              "ELearning is a programming community which is developed by Musharraf hussain for helping programmers"
            }
            keywords={data?.ebook?.level}
          />
         
       

            <ShowEbook
              data={data.ebook}
             
            />
  
        </div>
      )}
    </>
  );
};

export default Page;
