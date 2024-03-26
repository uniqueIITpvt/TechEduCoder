import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { format } from "timeago.js";

type Props = {
  blog: any;
  isProfile?: boolean;
};


const BlogCard: FC<Props> = ({ blog }) => {
  const body = blog.BlogContent
  return (
    <Link href={`/blog/${blog?._id}`}>
   
      <div className="md:flex border-[1px]  flex h-auto p-2 rounded-md shadow-md hover:-translate-y-1 hover:scale-70  duration-200">
        <div className="md:flex md:h-[10rem] overflow-hidden  w-[10rem] h-[10rem] flex  mt-2">
          <Image
            className="  object-cover md:h-auto md:w-48 items-center justify-center rounded-md"
            src={blog?.thumbnail.url}
            // fill={true}
            width={500}
            height={300}
            // src={require('../../../public/assests/image-1.jpg')}
            alt="blogs image"
          />
          {/* <Image className="h-48 w-full object-cover md:h-auto md:w-48" src="/path-to-your-image.jpg" alt="Woman's Face"> */}
        </div>
        <div className="p-3 flex flex-col justify-between">
          <div>
            <div className="uppercase font-sans text-[12px] text-white p-1  w-[70px] rounded-sm mb-4 flext items-center text-center bg-indigo-500 font-[400]">
              {" "}
             <h1> {blog?.category}</h1>
            </div>
            <Link
              href={`/blog/${blog._id}`}
              className="block mt-1 text-[26px]  font-[700] text-black hover:underline truncate ... "
            >
              {" "}
              <h1>{blog.Title.slice(0, 25)}</h1>

            </Link>
            <div className="flex"><div className="text-[17px] text-bloack font-[600] mr-3"><span className="text-[14px] text-gray-500 font-poppins">by </span>{blog.authorName}</div>
            <div className="text-[14px] font-[400] text-gray-500">
            {" "}
             - {format(blog?.createdAt)}
            </div>
           
            </div>
           
          </div>
          <div className=" md:mt-0">
          <p className="mt-2 text-gray-500  text-[17px] font-poppins font-[500] truncate ...">
              {/* {blog.BlogContent.slice(0, 40)} */}
              <div  dangerouslySetInnerHTML={{__html: body.slice(0, 40)}} />
            </p>
            <div>
              {" "}
              <Link href={`/blog/${blog._id}`}>
                <IoArrowForwardCircleOutline size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
