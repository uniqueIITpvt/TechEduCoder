import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useCreateMessageMutation } from "@/redux/features/contactUs/contactUsApi";
import { FcHome } from "react-icons/fc";
import { FcIphone } from "react-icons/fc";
import { FcInvite } from "react-icons/fc";
import { FcIpad } from "react-icons/fc";

import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogsApi";
import BlogCard from "../components/blogs/BlogsCard/BlogsCard";
import { styles } from "@/app/styles/style";
import Link from "next/link";

type Props = {};

const Blogs = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllBlogsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [blog, setBlog] = useState<any[]>([]);
  // console.log(data)
  useEffect(() => {
    if (data) {
      setBlog(data.blogs);
    }
  }, [data]);
  console.log(blog);

  return (
    !isLoading && (
      <>
        <div className=" h-[10rem] w-full bg-gray-700">
          <h1 className="font-poppins font-[700] text-[50px] text-white p-10 ">Blog</h1>
        </div>
        <div className="w-[90%] m-auto mt-16">
         
            {/* Article Section */}
            <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
              {/* Main Content */}
             <div className="md:col-span-2 "> 
              <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-rows-3 lg:grid-rows-4 gap-4 rows-span-4 w-full ">
          {blog.map((blog: any, i: number) => (
            <BlogCard key={i} blog={blog} />
          ))}
        </div>

           


             </div>

              {/* Sidebar Widgets */}
              <div className="md:col-span-1">
                {/* Advertisement Widget */}
                <div className="bg-red-500 rounded-xl overflow-hidden shadow-lg max-w-sm  mx-auto  items-center flex">
                  <div className="p-6">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      logo
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2">
                      Posty
                    </h2>
                    <p className="text-white text-base mb-4">
                      News & Magazine Blog WordPress Theme
                    </p>
                    <button className="bg-blue-600 text-white text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
                      Buy Now
                    </button>
                  </div>
                  {/* <Image className="w-full" src="/path-to-your-character-image.png" alt="Character image"> */}
                </div>

                {/* Recent Posts Widget */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  {/* Post Items */}
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
                    <ul className="list-none space-y-3">
                      {blog.map((blog: any, index: number) => (
                      <li
                        key={index}
                        className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                      >
                        <Link href={blog._id}>{blog.Title}</Link>
                      </li>
                    ))}
                    </ul> 
                  </div>
                
                </div>
              </div>
            </div>
          
        </div>
      </>
    )
  );
};

export default Blogs;
