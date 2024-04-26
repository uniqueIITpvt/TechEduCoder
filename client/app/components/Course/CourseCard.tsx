import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BiDotsHorizontal } from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <div className="w-full  bg-white dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-md  shadow-md dark:shadow-inner  hover:-translate-y-1 hover:scale-70  duration-200">
      <Link
        href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
      >
        <div className="h-[9rem] overflow-hidden rounded-md">
          <Image
            src={item.thumbnail.url}
            width={500}
            height={300}
            className="rounded-t- object-cover"
            alt=""
          />
        </div>
        <div className="px-3 pt-[0.5rem]">
          <h1 className="mb-2 text-[20px] font-[600] hover:text-blue-600 opacity-90 text-[#000000] dark:text-white truncate ... font-poppins">
            {item.name.slice(0, 20)}
            {/* <span><BiDotsHorizontal/> </span> */}
            {/* Slice the name to display first 20 characters */}
          </h1>
          <div className="w-full flex items-center justify-between pt-2">
            <Ratings rating={item.ratings} />
            <h5
              className={`text-black dark:text-[#fff] ${
                isProfile && "hidden 800px:inline"
              } font-[500] font-poppins  text-[17px]`}
            >
              {item.purchased} Students
            </h5>
          </div>
          <div className="w-full flex items-center justify-between pt-3">
            <div className="flex">
              <h3 className="text-black dark:text-[#fff] font-poppins font-[700] text-[15px] ">
                {item.originalPrice === 0 ? "Free" : "₹ " + item.discountPrice.toFixed(2)}
              </h3>
              <h5 className="pl-2 text-[15px] mt-[-5px] line-through opacity-80  dark:text-[#fff] text-red-600">
                {item.originalPrice === 0 ? " " : "₹ " + item.originalPrice.toFixed(2)}
              </h5>
            </div>
            <div className="flex items-center pb-3">
              <AiOutlineUnorderedList size={20} fill="#fff" />
              <h5 className="pl-2 text-black dark:text-[#fff] font-poppins font-[500] text-[17px]">
                {item.courseData?.length} Lectures
              </h5>
            </div>
          </div>
        </div>
      </Link>
      <br />
      <div className="px-3 pb-5">
        <Link
          href={
            !isProfile ? `/course/${item._id}` : `course-access/${item._id}`
          }
          className=" rounded-lg text-[#ffffff] py-2 font-[500] font-poppins text-[17px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br hover:text-white  delay-100 bg-blue-500   duration-200"
        >
          Enroll Now{" "}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
