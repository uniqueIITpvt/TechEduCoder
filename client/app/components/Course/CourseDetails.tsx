import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { AiOutlineUnorderedList } from "react-icons/ai";
type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setRoute: any;
  setOpen: any;
};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [activeBar, setactiveBar] = useState(0);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const dicountPercentenge =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
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
      <div className="w-[90%] m-auto mt-20 mb-10 ">
        <div className="w-full  ">
          <div className="">
            {" "}
            <h1 className="text-[26px] font-[700] font-poppins  leading-6  m-2 mb-10 truncate...">
              {data.name}
            </h1>
          </div>
          <div className="flex justify-between font-poppins leading-6">
            <h3 className="m-2 text-[14px] font-poppins font-[400]">
              <span className="text-slate-700">category: </span>{" "}
              <Link href={``}>{data.categories}</Link>
            </h3>
            <div className="flex justify-between">
              <Link href={``} className="px-10  ">
                {" "}
                <div className="flex items-center px-3">
                  <MdOutlineContentCopy size={20} />
                  <h3 className="text-[16px] font-poppins font-[400] dark:text-white text-black mx-1 ">
                    WhishList{" "}
                  </h3>
                </div>{" "}
              </Link>
              <Link href={``} className="px-2">
                {" "}
                <div className="flex px-2 items-center ">
                  <IoIosShareAlt size={30} />
                  <h3 className="text-[16px] font-poppins font-[400] dark:text-white text-black mx-1">
                    Share{" "}
                  </h3>
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
            <div className="w-full p-4  flex items-center justify-start  border-b-2 border-[#e4e6ee]  backdrop-blur shadow-[bg-slate-700]  rounded shadow-inner">
              {["Overview", "Reviews"].map((text, index) => (
                <h5
                  key={index}
                  className={`800px:text-[20px] cursor-pointer ${
                    activeBar === index
                      ? "text-[#3e64de] border-b-2 border-[#3e64de] "
                      : "dark:text-white text-black"
                  } mr-10`}
                  onClick={() => setactiveBar(index)}
                >
                  {text}
                </h5>
              ))}
            </div>
            {activeBar === 0 && (
              <div>
                <div className="w-full border-1 border-[#e4e6ee] m-2">
                  <h1 className="text-[26px] font-[700] leading-7 dark:text-white text-black font-poppins">
                    About Course{" "}
                  </h1>
                  <h2 className="text-[17px] font-poppins  font-[500] mt-5 dark:text-white   text-black leading-7">
                    {data.description}
                  </h2>
                </div>
                <div className="w-full mt-7">
                  <h1 className="text-[26px] font-[700] leading-7 dark:text-white text-black font-poppins">
                    What will you learn ?{" "}
                  </h1>

                  <div className="text-[17px] font-poppins  font-[400] mt-5 dark:text-white   text-black leading-7 flex-row flex gap-10">
                    {data.benefits?.map((item: any, index: number) => (
                      <div
                        className="w-full flex 800px:items-center py-2"
                        key={index}
                      >
                        <div className="w-[15px] mr-1">
                          <IoCheckmarkDoneOutline
                            size={20}
                            className="text-black dark:text-white"
                          />
                        </div>
                        <p className="pl-2 text-black dark:text-white">
                          {item.title}
                        </p>
                      </div>
                    ))}
                    <br />
                  </div>
                  <div className="w-full ">
                    <h1 className="text-[27px] font-Poppins font-[700] text-black dark:text-white ">
                      Course Content
                    </h1>
                    <CourseContentList data={data?.courseData} isDemo={true} />
                  </div>
                </div>
              </div>
            )}
            {activeBar === 1 && (
              <div>
                {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
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
                )
              )}
              </div>
            )}
          </div>
          <div className="lg:col-span-1 ">
            <div className="w-[80%] m-auto shadow-md rounded-xl ">
              <div className=" w-full  border bg-[#d5e5fd] flex  flex-col  items-center p-16 rounded-t-xl">
                <div className="  inline-flex ">
                  <h3 className=" text-[18px] text-black dark:text-white font-[700] font-poppins mx-3 ">
                    {data.originalPrice === 0 ? "Free" :"₹"+ data.originalPrice }{" "}
                  </h3>
                  <p className="text-[20px] line-through opacity-60 text-red-400 dark:text-white mx-3">
                    {data.originalPrice===0? " " :"₹"+ data.discountPrice}
                  </p>

                  <p className="text-[16px] text-[#3539fa] dark:text-white  font-[500] ">
                    { data.originalPrice ===0 ? "" : discountPercentengePrice}% Off
                  </p>
                </div>
                <div className="flex items-center mt-5">
                  {isPurchased ? (
                    <Link
                    className={`${styles.button}`}
                      // className=" rounded-md text-[#ffffff] py-2 px-2 font-[500] font-poppins text-[18px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br hover:text-white  delay-100 bg-blue-500   duration-200 cursor-pointer"
                      href={`/course-access/${data._id}`}
                    >
                      Enter to Course
                    </Link>
                  ) : (
                    <div
                    className={`${styles.button}`}
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
                <h1 className="text-[17px]  flex dark:text-white text-black font-[400] font-poppins items-center ">
                  <span className="mr-2">
                    <SiLevelsdotfyi />
                  </span>
                  {data.level}
                </h1>
                <h1 className="text-[16px]  flex items-center  dark:text-white text-black font-[400] font-poppins ">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <FaGraduationCap />
                  </span>{" "}
                  {data.purchased} Students Enrolled
                </h1>
                <h1 className="text-[16px]  flex items-center  dark:text-white text-black font-[400] font-poppins ">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <MdOutlineWatchLater />
                  </span>
                  {totalVideoLengthInHours}
                  {totalVideoLengthInHours < 60 ? " minutus" : " hours"}
                </h1>

                <h5 className=" flex items-center  text-black dark:text-[#fff] font-poppins font-[500] text-[17px]">
                  <span className="mr-2">
                    {" "}
                    <AiOutlineUnorderedList size={20} />
                  </span>
                  {data.courseData?.length} Lectures
                </h5>
                <h1 className="text-[17px]  flex items-center  dark:text-white text-black font-[400] font-poppins mb-2 ">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <RxUpdate />{" "}
                  </span>
                  {format(data.createdAt)}
                </h1>
              </div>
            </div>
            <div className="w-[80%] m-auto p-2 shadow-xl ">
              <h1 className="text-[27px] font-[700]  dark:text-white text-black font-poppins m-4">
                Materials Included?{" "}
              </h1>
              {data.prerequisites?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2 font-[400] text-[17px]"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
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
        )}
      </>
    </div>
  );
};

export default CourseDetails;
