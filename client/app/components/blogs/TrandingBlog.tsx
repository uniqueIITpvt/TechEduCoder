import { Linden_Hill } from 'next/font/google';
import Link from 'next/link';
import React, { FC } from 'react'
import Image from 'next/image';
import { format } from 'timeago.js';

type Props = {
    blog: any;
    isProfile?: boolean;
  };
  

const TrandingBlog: FC<Props> = ({ blog }) => {
  return (
   
      
    <Link href={`/blog/${blog?._id}`}> 
    

            
    <div className="px-6  ">
      <div className="border mt-2 p-3 border-grey-200 shadow-md flex  rounded-md ">
      <div className="md:flex h-[5rem] w-[5rem] overflow-hidden ">
          <Image
            className="  object-cover md:h-auto md:w-48 items-center justify-center rounded-md"
            src={blog?.thumbnail.url}
            // fill={true}
            width={500}
            height={300}
            alt="blogs image"
          />
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-blue-500 text-sm mb-2">
          <h1>{blog.Title}</h1>
          </div>
          <p className="text-gray-700 text-base">      {format(blog?.createdAt)}</p>
        </div>
      </div>
    </div>

  </Link>


  )
}

export default TrandingBlog
