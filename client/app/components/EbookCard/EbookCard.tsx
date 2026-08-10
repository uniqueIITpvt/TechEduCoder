import { styles } from "@/app/styles/style";
import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { IoIosStar } from "react-icons/io";

type Props = {
  item: any;
  isProfile?: boolean;
};

const EbookCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <div className="w-[90%]  mx-auto bg-slate-100 dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur dark:border-[#ffffff1d]  dark:shadow-[bg-slate-700] rounded-lg  shadow-sm   hover:-translate-y-1 hover:scale-70  duration-100">
      <Link href={`/eBooks/${item._id}`}>
        <div className="border border-red-500 p-2  rounded-t-[4px]">
          <div className="h-[18rem] overflow-hidden md:h-auto  ">
            <Image
              src={item.thumbnail.url}
              width={500}
              height={300}
              className=" object-cover"
              alt=""
            />
          </div>
        </div>
        <div className="px-3 flex flex-col  items-center justify-center mt-1  ">
        <Ratings rating={item.ratings} />
          <h1 className=" text-[17px] font-[500] font-poppins  text-[#3b3b3b]  dark:text-white text-center ">
            {item.ebookTitle.slice(0, 20)}
          </h1>

          <h1 className="text-[17px] font-[500] font-poppins dark:text-white  text-black leading-6 ">
            {item.authorName}
          </h1>

        
          <h1 className="bg-[#388e3c] mt-2 text-white dark:text-black p-1 rounded-lg  text-[13px] flex items-center">
            {item.ratings}{" "}
            <span>
              <IoIosStar />
            </span>
          </h1>

          <div className="flex mt-2">
            <h3 className="text-black dark:text-[#fff] font-poppins font-[700] text-[17]">
              {item.originalPrice === 0 ? "Free" : "₹ " + item.originalPrice}
            </h3>
            <h5 className="pl-3 text-[17px]  font-[500] mt-[-5px] line-through opacity-80 text-red-900 dark:text-[#fff]">
              {item.originalPrice === 0 ? " " : "₹ " + item.discountPrice}
            </h5>

            <div className="flex items-center pb-3"></div>
          </div>
        </div>
      </Link>
      <br />
    </div>
  );
};

export default EbookCard;
