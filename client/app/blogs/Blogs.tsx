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
import YouTube from "react-youtube";

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

  const opts = {
    height: "260",
    width: "400",
    playerVars: {
      autoplay: 0,
    },
  };
  function handleVideoReady(event: any) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo(); // example of pausing the video when it's ready
  }

  return (
    !isLoading && (
      <>
        <div className=" h-[10rem] w-full bg-gradient-to-r from-blue-500 to-[#521088] flex items-center justify-center">
          <h1 className="font-poppins font-[700] text-[50px] text-white p-10 ">
            Blogs
          </h1>
        </div>
        <div className="w-[90%] m-auto mt-16">
          {/* Article Section */}
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
            {/* Main Content */}
            <div className="md:col-span-2 ">
              <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-rows-3 lg:grid-rows-4 gap-4 rows-span-4 w-full ">
                {blog.slice(0, 10).map((blog: any, i: number) => (
                  <BlogCard key={i} blog={blog} />
                ))}
              </div>
            </div>

            <div className="md:col-span-1">
              {/* Advertisement Widget */}
              <YouTube
                videoId="WLcaNNHoUJ0"
                opts={opts}
                onReady={handleVideoReady}
              />

              <br />
              <br />
              <br />
              <div className="bg-white p-4 rounded-sm">
                {/* Post Items */}
                <div className="bg-white shadow-sm rounded-md p-6">
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
