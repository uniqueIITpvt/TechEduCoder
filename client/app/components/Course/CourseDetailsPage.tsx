import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useValidateRazorpayPaymentMutation,
  useGetRazorpayKeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

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
  const [createOrder] = useCreateOrderMutation();
  const [  validateRazorpayPayment] = useValidateRazorpayPaymentMutation();
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log("Razorpay script loaded and ready");
    };
    document.body.appendChild(script);
  
    // Optional: Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  

  const handlePayment = async (e: any) => {
  
  
    if (typeof window.Razorpay !== 'function') {
      console.error('Razorpay SDK is not loaded.');
      return;
    }
  
    const amount = Math.round(data.course.discountPrice * 100);
    const currency = "INR"; 
    // await createOrder({ amount, currency, courseId: id });
    const response = await fetch("https://techeducoder-lrel.onrender.com/api/v1/create-order", {
      method: "POST",
      body: JSON.stringify(
        { amount, currency, courseId: id }
      ),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);
    // const orderResponse = await createOrder({ amount, currency, courseId: id }).unwrap();

    // Check the response
    // console.log('Order Response:', orderResponse);

    const options = {
      key: "rzp_test_DqTTqV6ObklsQm",
      amount: amount, // Make sure this is correct
      currency:currency,
      name: "Course Payment",
      description: "Payment for your course",
      // orderazorpayOrderIdr_id: orderResponse.,
      handler: async function (response:any) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
        await validateRazorpayPayment({
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
        });
        console.log(  "rezorpay", razorpay_order_id, razorpay_payment_id, razorpay_signature );
 console.log( " response ",response);
        alert('Payment successful!');
      },
      prefill: {
        name: userData.user.name,
        email: userData.user.email,
      },
      theme: {
        color: "#F37254"
      }
    };
  
    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
        e.preventDefault();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
    }
  };
  




  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.course.name + " - UniqueIIT "}
            description={
              "ELearning is a programming community which is developed by Musharraf hussain for helping programmers"
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
              handlePayment={handlePayment}
              setRoute={setRoute}
              setOpen={setOpen}
            />
     
        <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
