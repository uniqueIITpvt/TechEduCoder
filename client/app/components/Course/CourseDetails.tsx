import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaGraduationCap, FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  data: any;
  setRoute: any;
  setOpen: any;
  
};

const CourseDetails = ({
  data,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [showMore, setShowMore] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [activeBar, setactiveBar] = useState(0);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);


  const handlePayment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
      toast.error("Razorpay SDK Failed to load");
      return;
    }
  
    const amount = Math.round(data.discountPrice * 100);
    const currency = "INR";
    const userId = user?._id;
  
    try {
      const response = await fetch("http://localhost:8000/api/v1/create-order", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          currency,
          courseId: data._id,
          userId
        })
      });
  
      const data1 = await response.json();
      if (!response.ok) {
        toast.error(data1.message);
      }

  
      var options = {
        key: process.env.KEY, 
        name: "Course Payment",
        currency: currency,
        amount: amount,
        order_id: data1.orderId,
        description: "Thank you for purchasing my course",
        handler: async function (response:any) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          try {
            const validationResponse = await fetch(
              "http://localhost:8000/api/v1/validate-order",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                }),
              }
            );
            const validationData = await validationResponse.json();
            if (validationData.success) {
              toast.success("Payment verification successful");
              refetch();  // Refetch user data or update purchase status
              setUser({ ...user, courses: [...user.courses, { _id: data._id }] }); // Update locally without refetching if possible
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error:any) {
            toast.error(error.message);
          }
        },
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
          paylater: false, 
        },
        prefill: {
          name: "tanwir alam",
          email: "tanw9004167@gmail.com",
          contact: "9835471132",
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error:any) {
      toast.error(error.message || "An error occurred during the payment process");
    }
  };
  
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };


  const dicountPercentenge =
    ((data?.originalPrice - data.discountPrice) / data?.originalPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);

    const handleOrder = (e: any) => {
      e.preventDefault(); 
      if (user) {
        handlePayment(); 
      } else {
        setRoute("Login"); 
        openAuthModal(true); 
      }
    };
    
  // Assuming videoLength is in minutes, convert the total length to hours
  const totalVideoLengthInHours = data.courseData.reduce(
    (total: any, video: any) => total + video.videoLength,
    0
  );

  if (totalVideoLengthInHours > 60) {
    totalVideoLengthInHours / 60;
  }

  return (
    <div className=" w-full ">
      <div className="w-[90%] m-auto mt-10 mb-5 ">
        <div className="w-full  ">
          <div className="">
            {" "}
            <h1 className="text-[27px] font-[700] font-poppins text-black  opacity-80">
              {data.name}
            </h1>
          </div>
          <div className="flex justify-between font-poppins  w-[98%]  ">
            <div>
              <h3 className="m-2 text-[17px] font-poppins font-[500] items-start text-black opacity-80">
                <span className="text-slate-400">category: </span>{" "}
                <Link href={``}>{data.categories}</Link>
              </h3>
            </div>
            <div className="  hidden md:flex md:justify-between">
              <Link href={``} className="px-[5rem]   ">
                {" "}
                <div className="flex items-center px-3">
                  <MdOutlineContentCopy size={20} />
                  <h3 className="text-[16px] font-poppins font-[400] dark:text-white text-[#212327] mx-1 ">
                    WhishList{" "}
                  </h3>
                </div>{" "}
              </Link>
              <Link href={``} className="px-2">
                {" "}
                <div className="flex px-2 items-center ">
                  <IoIosShareAlt size={30} />
                  <p className="text-[16px] font-poppins font-[400] dark:text-white text-[#212327] mx-1">
                    Share{" "}
                  </p>
                </div>{" "}
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* course content  */}
            <div className=" mb-10">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
            </div>
            <div className="w-full p-4  text-[17px] flex items-center justify-start  border-b-2 border-[#e4e6ee]  backdrop-blur shadow-[bg-slate-700]  rounded shadow-inner">
              {["Overview", "Reviews"].map((text, index) => (
                <h5
                  key={index}
                  className={`800px:text-[20px] cursor-pointer ${
                    activeBar === index
                      ? "text-[#3e64de] border-b-2 border-[#3e64de] "
                      : "dark:text-white text-[#41454f]"
                  } mr-10`}
                  onClick={() => setactiveBar(index)}
                >
                  {text}
                </h5>
              ))}
            </div>
            {activeBar === 0 && (
              <div>
                <div className="w-full border-1 border-[#e4e6ee] my-2">
                  <h1 className="text-[26px] font-[700] leading-7 dark:text-white text-[#34373d] font-poppins">
                    About Course{" "}
                  </h1>
                  <h2 className="text-[17px] font-poppins  font-[500] mt-5 dark:text-white   text-[#27292e]  ">
                    {/* {data.description} */}
                    {showMore
                      ? data.description
                      : `${data.description.substring(0, 250)}`}
                  </h2>
                  <button
                    className=" text-blue-600 font-medium text-[17px] flex  items-center justify-center opacity-70 "
                    onClick={() => setShowMore(!showMore)}
                  >
                    {" "}
                    {showMore ? (
                      <>
                        <FaMinus className="mr-2" /> Read less
                      </>
                    ) : (
                      <>
                        <FaPlus className="mr-2" /> Read more
                      </>
                    )}
                  </button>
                </div>
                <div className="w-full mt-7">
                  <h1 className="text-[27px] font-[700] leading-7 dark:text-white text-black font-poppins opacity-80">
                    What will you learn ?{" "}
                  </h1>

                  <div className="text-[17px] font-poppins  font-[400] mt-5 dark:text-white   text-black  opacity-90 ">
                    {readMore
                      ? data.benefits?.map((item: any, index: number) => (
                          <div className="w-full flex py-1 " key={index}>
                            <div className="w-[15px] mr-1">
                              <GoDotFill
                                size={20}
                                className="text-black dark:text-white"
                              />
                            </div>
                            <p className="pl-2 text-black dark:text-white opacity-80">
                              {item.title}
                            </p>
                          </div>
                        ))
                      : data.benefits
                          ?.slice(0, 2)
                          .map((item: any, index: number) => (
                            <div className="w-full flex py-1" key={index}>
                              <div className="w-[15px] mr-1">
                                <GoDotFill
                                  size={20}
                                  className="text-black dark:text-white opacity-80"
                                />
                              </div>
                              <p className="pl-2 text-black dark:text-white opacity-80">
                                {item.title}
                              </p>
                            </div>
                          ))}

                    <button
                      className=" text-blue-600 font-medium text-[17px] flex  items-center justify-center opacity-80 "
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? (
                        <>
                          <FaMinus className="mr-2" /> Read less
                        </>
                      ) : (
                        <>
                          <FaPlus className="mr-2" /> Read more
                        </>
                      )}
                    </button>
                  </div>
                  <div className="w-full ">
                    <h1 className="text-[27px] font-Poppins font-[700] text-black dark:text-white opacity-70 ">
                      Course Content
                    </h1>
                    <CourseContentList data={data?.courseData} isDemo={true} />
                  </div>
                </div>
              </div>
            )}
            {activeBar === 1 && (
              <div>
                {data?.reviews?.length === 0 ? (
                  <p className="text-black dark:text-white items-center mt-10 ml-20  font-sans font-[600] text-[20px] ">
                    No reviews given.
                  </p>
                ) : (
                  [...data.reviews]
                    .reverse()
                    .map((item: any, index: number) => (
                      <div className="w-full pb-4" key={index}>
                        <div className="flex">
                          <div className="w-[50px] h-[50px]">
                            <Image
                              src={
                                item.user.avatar
                                  ? item.user.avatar.url
                                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                              }
                              width={50}
                              height={50}
                              alt=""
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="hidden 800px:block pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                {item.user.name}
                              </h5>
                              <Ratings rating={item.rating} />
                            </div>
                            <p className="text-black dark:text-white">
                              {item.comment}
                            </p>
                            <small className="text-[#000000d1] dark:text-[#ffffff83]">
                              {format(item.createdAt)} •
                            </small>
                          </div>
                          <div className="pl-2 flex 800px:hidden items-center">
                            <h5 className="text-[18px] pr-2 text-black dark:text-white">
                              {item.user.name}
                            </h5>
                            <Ratings rating={item.rating} />
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-1 ">
            <div className="w-full m-auto shadow-sm rounded-lg  border-[1px] border-[#a6aec0]">
              <div className=" w-full  border bg-[#eaf0fa] flex  flex-col  justify-center items-center pt-16 pb-16 rounded-t-lg">
                <div className="  flex  w-[70%] items-center  ">
                  <h3 className=" text-[24px] text-black dark:text-white font-[700] font-poppins mr-[0.8rem] ">
                    {data.originalPrice === 0
                      ? "Free"
                      : "₹" + data.discountPrice.toFixed(2)}{" "}
                  </h3>
                  <p className="text-[16px] line-through opacity-80 text-[#383a3b] font-[600] dark:text-white mr-[0.8rem]">
                    {data.originalPrice === 0 ? " " : "₹" + data.originalPrice}
                  </p>

                  <p className="text-[16px] text-[#36393b] dark:text-white  font-[500] mr-[0.8rem] ">
                    {data.originalPrice === 0
                      ? ""
                      : discountPercentengePrice + "% Off"}
                  </p>
                </div>
                <div className="flex items-center mt-5  w-[70%] ">
                  {isPurchased ? (
                    <Link
                      className={`${styles.button} !w-full !items-center !justify-center`}
                      // className=" rounded-md text-[#ffffff] py-2 px-2 font-[500] font-poppins text-[18px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br hover:text-white  delay-100 bg-blue-500   duration-200 cursor-pointer"
                      href={`/course-access/${data._id}`}
                    >
                      Enter to Course
                    </Link>
                  ) : (
                    <div
                      className={`${styles.button} !w-full !items-center !justify-center`}
                      // className=" rounded-md text-[#ffffff] py-2 px-2 font-[500] font-poppins text-[18px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br hover:text-white  delay-100 bg-blue-500   duration-200 cursor-pointer"
                      onClick={handleOrder}
                    >
                      Buy Now
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full m-6 leading-8 ">
                <div className="flex   items-center ">
                  <Ratings rating={data?.ratings} />

                  <h5 className="text-[20px] font-Poppins text-black dark:text-white">
                    ({" "}
                    {Number.isInteger(data?.ratings)
                      ? data?.ratings.toFixed(1)
                      : data?.ratings.toFixed(2)}{" "}
                    )
                  </h5>
                </div>
                <h1 className="text-[16px]  flex dark:text-white text-black font-[400] font-poppins items-center  opacity-80">
                  <span className="mr-2">
                    <SiLevelsdotfyi />
                  </span>
                  {data.level}
                </h1>
                <h1 className="text-[16px]  flex items-center  dark:text-white text-black font-[400] font-poppins opacity-80">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <FaGraduationCap />
                  </span>{" "}
                  {data.purchased} Students Enrolled
                </h1>
                <h1 className="text-[16px]  flex items-center  dark:text-white text-black font-[400] font-poppins opacity-80 ">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <MdOutlineWatchLater />
                  </span>
                  {totalVideoLengthInHours}
                  {totalVideoLengthInHours < 60 ? " minutus" : " hours"}
                </h1>

                <h5 className=" flex items-center  text-black dark:text-[#fff] font-poppins font-[500] text-[16px] opacity-80">
                  <span className="mr-2">
                    {" "}
                    <AiOutlineUnorderedList size={20} />
                  </span>
                  {data.courseData?.length} Lectures
                </h5>
                <h1 className="text-[16px]  flex items-center  dark:text-white text-black font-[400] font-poppins mb-2  opacity-80">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <RxUpdate />{" "}
                  </span>
                  {format(data.createdAt)}
                </h1>
              </div>
            </div>
            <div className="w-full m-auto  shadow-sm border-[1px] border-[#a6aec0] rounded-lg mt-6 p-3 ">
              <h1 className="text-[27px] font-[700]  dark:text-white text-black font-poppins m-4 opacity-70">
                Materials Included?{" "}
              </h1>
              {seeMore
                ? data.prerequisites?.map((item: any, index: number) => (
                    <div
                      className="w-full flex  py-2  font-[400] text-[17px]"
                      key={index}
                    >
                      <div>
                        <GoDotFill
                          size={20}
                          className="text-black dark:text-white mt-1"
                        />
                      </div>
                      <p className="pl-2 text-black dark:text-white flex item-center justify-center">
                        {item.title}
                      </p>
                    </div>
                  ))
                : data.prerequisites
                    ?.slice(0, 2)
                    .map((item: any, index: number) => (
                      <div
                        className="w-full flex  py-2  font-[400] text-[17px]"
                        key={index}
                      >
                        <div>
                          <GoDotFill
                            size={20}
                            className="text-black dark:text-white mt-1"
                          />
                        </div>
                        <p className="pl-2 text-black dark:text-white flex item-center justify-center">
                          {item.title}
                        </p>
                      </div>
                    ))}
              <button
                className=" text-blue-600 font-medium text-[17px] flex  items-center justify-center opacity-70 "
                onClick={() => setSeeMore(!seeMore)}
              >
                {seeMore ? (
                  <>
                    <FaMinus className="mr-2" /> Read less
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Read more
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <>
        {/* {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-lg shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm
                      setOpen={setOpen}
                      data={data}
                      user={user}
                      refetch={refetch}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )} */}
      </>
    </div>
  );
};

export default CourseDetails;
