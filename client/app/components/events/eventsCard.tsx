
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
type Props = {
  matchingCourse : any;
  isProfile?: boolean;
};

const EventsCard: FC<Props> = ({ matchingCourse , isProfile }) => {
  return (
    <div className="w-full  bg-white dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-md  shadow-2xl dark:shadow-inner  hover:-translate-y-1 hover:scale-70  duration-200">
      <Link
        href={!isProfile ? `/course/${matchingCourse._id}` : `course-access/${matchingCourse._id}`}
      >
        <div className="h-[9rem] overflow-hidden">
          <Image
            src={matchingCourse.thumbnail.url}
            width={500}
            height={300}
            className="rounded-t- object-cover"
            alt=""
          />
        </div>

        <br />
        <div className="px-3">
          <h1 className="mb-2 text-[18] font-[700] text-[#000000] dark:text-white truncate ... font-poppins leading-5">
            {matchingCourse.name.slice(0, 20)}
            {/* <span><BiDotsHorizontal/> </span> */}
            {/* Slice the name to display first 20 characters */}
          </h1>
          <div className="w-full flex items-center justify-between pt-3">
            <div className="flex">
              <h3 className="text-black dark:text-[#fff] font-poppins font-[700] text-[15px] ">
                {matchingCourse.originalPrice === 0 ? "Free" : "₹ " + matchingCourse.discountPrice.toFixed(2)}
              </h3>
              <h5 className="pl-2 text-[15px] mt-[-5px] line-through opacity-80  dark:text-[#fff] text-red-600">
                {matchingCourse.originalPrice === 0 ? " " : "₹ " + matchingCourse.originalPrice.toFixed(2)}
              </h5>
            </div>
            
          </div>
        </div>
      </Link>
      <br />
      <div className="px-3 pb-5">
        <Link
          href={
            !isProfile ? `/course/${matchingCourse._id}` : `course-access/${matchingCourse._id}`
          }
          className=" rounded-lg text-[#ffffff] py-2 font-[500] font-poppins text-[17px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br hover:text-white  delay-100 bg-blue-500   duration-200"
        >
          Enroll Now{" "}
        </Link>
      </div>
    </div>
  );
};

export default EventsCard;
