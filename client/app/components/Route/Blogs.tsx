import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useCreateMessageMutation } from "@/redux/features/contactUs/contactUsApi";
import { FcHome } from "react-icons/fc";
import { FcIphone } from "react-icons/fc";
import { FcInvite } from "react-icons/fc";
import { FcIpad } from "react-icons/fc";

import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogsApi";
import BlogCard from "../blogs/BlogsCard/BlogsCard";
import { styles } from "@/app/styles/style";
import TrandingBlog from "../blogs/TrandingBlog";

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


  return (
    <div>
    <div className="text-black dark:text-white w-[90%] m-auto ">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        {/* Get in */}
        <span className="text-gradient">
          Explore the Latest in Tech Literature
        </span>
      </h1>
     

      
    
      
    
        
      </div>
      <div className="flex items-center justify-center pl-7  w-full">
        <h2 className="800px:!text-[25px] text-[18px] text-black dark:text-white font-[700] font-Poppins text-center">
          Latest Post
        </h2>
        <div className="border-2 border-red-700 w-[80%] mx-6"></div>
      </div>
      <br />
      <br />

      <div className='grid grid-cols-1 justify-start items-center gap-10  mb-10 md:grid md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 lg:p-1 md:p-0 md:justify-start md:items-start md:mx-20 md:gap-10 p-10'>
          {blog.map((blog: any, i: number) => (
            <BlogCard key={i} blog={blog} />
          ))}
        </div>
      </div>
  
  );
};

export default Blogs;
