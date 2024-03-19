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
    if (allBlog) {
      setBlogs(allBlog.blogs);
    }
  }, [allBlog]);
 

  return (
    !isLoading && (
      <div className="w-[90%] m-auto mt-16">
        <div className=" mx-auto px-4">
          {/* Article Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="mb-4">
                {/* <span className="text-white bg-indigo-600 m-3 p-2 font-[500] ">
                  {blog?.category}
                </span> */}
                <h1 className="text-[26px]  font-[700]  font-poppins my-2">{blog?.Title}</h1>
                <div>
                  <p className="text-[18px] text-black font-poppins font-[700]"><span className=" text-[14px] text-gray-500 font-poppins font-[400]">by </span>{blog.authorName}</p>
                  <p className="text-[17px] text-black font-poppins font-[500]">
                    {format(blog.createdAt)}
                  </p>
                  <p className="text-[18] font-[700] font-poppins">{blog.BlogContent.slice(0, 200)}</p>
                </div>

                <div className="flex space-x-2 mb-4">
                  {/* Social Media Icons Here */}
                </div>
                <Image
                  src={blog.thumbnail.url}
                  alt=""
                  width={400}
                  height={400}
                  className="w-full rounded-sm shadow-md mb-4"
                ></Image>

                <p className="text-black dark:text-white text-[17px] font-[500] font-poppins">{blog.BlogContent}</p>
              </div>
              {/* comment form  */}
              <CommentForm />
            </div>

            {/* Sidebar Widgets */}
            <div className="md:col-span-1 mt-36">
              {/* Advertisement Widget */}
              <div className="bg-red-500 rounded-xl overflow-hidden shadow-lg max-w-sm  mx-auto  items-center flex">
                <div className="p-6">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    logo
                  </div>
                  <h2 className="text-white text-[26px]  font-[700] font-poppins mb-2">TechEduCoder</h2>
                  <p className="text-white text-[17px] font-poppins font-[500]  mb-4">
                    Ebook & Magazine  in React and Next js
                  </p>
                  <button className={`${styles.button}`}
                  //  className="bg-blue-600 text-white text-[] font-bold uppercase px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
                   >
                    Buy Now
                  </button>
                </div>
                {/* <Image className="w-full" src="/path-to-your-character-image.png" alt="Character image"> */}
              </div>

              {/* Recent Posts Widget */}
              <div className="">
                {/* Post Items */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <h2 className="text-[26px] font-[700]  font-poppins mb-4">Recent Posts</h2>
                  <ul className="list-none space-y-3">
                    {blogs.map((blog: any, index: number) => (
                      <li
                        key={index}
                        className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out text-[17px] font-poppins font-[500]"
                      >
                        <Link href={blog._id}>{blog.Title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Additional post items here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BlogDetails;
