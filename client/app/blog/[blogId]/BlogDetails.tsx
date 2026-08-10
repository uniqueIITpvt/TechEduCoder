// import React from 'react'
import Image from "next/image";
import { useEffect, useState } from "react";
import { paramsType } from "./page";
import {
  useGetAllBlogsQuery,
  useGetBlogQuery,
} from "@/redux/features/blogs/blogsApi";
import { format } from "timeago.js";
import CommentForm from "../../components/blogs/CommentForm";
import Link from "next/link";
import { styles } from "@/app/styles/style";

const BlogDetails = ({ params }: paramsType) => {
  const { blogId } = params;
  const { data, isLoading } = useGetBlogQuery(params?.blogId as string);
  const blog = data?.blog;

  const { data: allBlog, refetch } = useGetAllBlogsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [blogs, setBlogs] = useState<any[]>([]);
  // console.log(data)
  useEffect(() => {
    if (allBlog && data) {
      setBlogs(allBlog.blogs);
    }
  }, [allBlog, data]);

  const body = blog?.BlogContent;
  return (
    !isLoading && (
      <div className="w-[80%] m-auto mt-10">
        <div className=" mx-auto px-4">
          {/* Article Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 ">
            {/* Main Content */}
            <div className="md:col-span-4">
              <div className="mb-4">
                {/* <span className="text-white bg-indigo-600 m-3 p-2 font-[500] ">
                  {blog?.category}
                </span> */}
                <h1 className="text-[50px]  leading-[57px] font-[700]  font-poppins my-2 text-black opacity-80">
                  {blog?.Title}
                </h1>
                <div  className="flex">
                  <div>
                    {" "}
                    <p className="text-[20px] text-black font-poppins font-[700] mr-5">
                      <span className=" text-[14px] text-gray-500 font-poppins font-[400]">
                        by{" "}
                      </span>
                      {blog.authorName}
                    </p>
                  </div>{" "}
                  <p className="text-[16px] text-black font-poppins font-[500]">
                    {format(blog.createdAt)}
                  </p>
               
                </div>

        
                <Image
                  src={blog.thumbnail.url}
                  alt=""
                  width={400}
                  height={400}
                  className="w-full rounded-sm shadow-md mb-10 mt-10"
                ></Image>

                <p className="text-black dark:text-white text-[22px] leading-[36px] font-[500] font-poppins opacity-80">
                  {" "}
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                </p>
              </div>
              {/* comment form  */}
              <CommentForm />
            </div>

            {/* Sidebar Widgets */}
            <div className="md:col-span-1 mt-36">
            
          
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BlogDetails;
