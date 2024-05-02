import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "timeago.js";

type Props = {
  blog: any;
  isProfile?: boolean;
};

const BlogCard: FC<Props> = ({ blog }) => {
  const body = blog.BlogContent;
  return (
    <Link href={`/blog/${blog?._id}`}>
      <div className="md:flex border-[1px]  w-full flex h-auto p-2 rounded-md shadow-md hover:-translate-y-1 hover:scale-70  duration-200 items-center justify-start">
        <div className=" hidden md:flex md:h-[10rem]   object-contain  w-[210px] pr-2 ">
          <Image
            className="  object-cover rounded-sm"
            src={blog?.thumbnail.url}
            // fill={true}
            width={500}
            height={300}
            // src={require('../../../public/assests/image-1.jpg')}
            alt="blogs image"
          />
         
        </div>
        <div className="pl-2  w-full">
          
            <h1 className="uppercase font-sans text-[14px] text-white p-1  rounded-sm bg-indigo-500 font-[400]  items-center  justify-center  flex w-[50px]">
              {" "}
             {blog?.category}
            </h1>

            <Link
              href={`/blog/${blog._id}`}
              className="block  md:text-[26px] text-[17]  md:font-[700] font-[500] text-black hover:underline truncate ...  opacity-80 "
            >
              {" "}
              <h1>{blog.Title.slice(0, 30)}...</h1>
            </Link>
            <div className="flex">
              <div className="md:text-[17px] text-[14px] text-black md:font-[600]  font-[400] mr-3">
                <span className="text-[14px] text-gray-500 font-poppins">
                  by{" "}
                </span>
                {blog.authorName}
              </div>
              <div className="text-[14px] font-[400] text-gray-500">
                {" "}
                - {format(blog?.createdAt)}
              </div>
            </div>
            <div className=" md:mt-0">
              <p className="mt-2 text-gray-500  md:text-[17px]  text-[14] font-poppins  md:font-[500] font-[400] truncate ...">
                {/* {blog.BlogContent.slice(0, 40)} */}
                <div dangerouslySetInnerHTML={{ __html: body.slice(0, 40) }} />
              </p>
              <div>
                {" "}
              
              </div>
            </div>
         
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
