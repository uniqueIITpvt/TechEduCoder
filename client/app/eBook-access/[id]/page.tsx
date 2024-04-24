"use client"
import React, { useEffect, useState } from "react";

import Heading from "@/app/utils/Heading";

import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

import { useGetEbookQuery } from "@/redux/features/ebook/ebooksApi";
import Loader from "../../components/Loader/Loader";
import Header from "../../components/Header";
import EbookDetails from "../../components/eBooks/EbookDetails";
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";

const  ShowEbook= dynamic(()=>import("../../components/eBooks/ShowEbook" ),{  ssr: false,} )



type Props = {

};

const Page = ({params}:any) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const id = params.id

  // const { data, isLoading } = useGetCourseDetailsQuery(id);
  // const { data: config } = useGetStripePublishablekeyQuery({});
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();

  const { data, isLoading } = useGetEbookQuery(id);
  const { data: config } = useGetStripePublishablekeyQuery({});
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      const publishablekey = config?.publishablekey;
      setStripePromise(loadStripe(publishablekey));
    }
    if (data && userData?.user) {
      const amount = Math.round(data.ebook.estimatedPrice * 100);
      createPaymentIntent(amount);
    }
  }, [config, data, userData]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);
 
 

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
         
       

            <ShowEbook
              data={data.ebook}
             
            />
  
        </div>
      )}
    </>
  );
};

export default Page;