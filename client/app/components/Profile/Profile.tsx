"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import avatarDefault from "../../../public/assests/avatar.png";
import ProfileInfo from "./ProfileInfo";
import EbookCard from "../EbookCard/EbookCard";
import { useGetAllEbooksQuery } from "@/redux/features/ebook/ebooksApi";
import EditProfileinfo from "./EditProfileInfo";
import { redirect } from "next/navigation";



type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const [ebooks, setEbooks] = useState<any[]>([]);

  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });
  const {  data:books, refetch } = useGetAllEbooksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (books) {
      const filteredbooks = user.books
        .map((userbooks: any) =>
          books?.ebooks.find((book: any) => book._id === userbooks._id)
        )
        .filter((course: any) => course !== undefined);
        setEbooks(filteredbooks);
    }

  }, [books]);

 

  const [active, setActive] = useState(1);

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
    redirect("/")
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
    }

  }, [data]);


  return (
    <div className="w-[85%] mx-auto ">
      <div className="flex items-center justify-start mt-10 ">
        <div className="mr-2 md:ml-0">
    
          <Image
            src={
              user.avatar || avatar ? user.avatar.url || avatar : avatarDefault
            }
            alt=""
            width={80}
            height={80}
            className=" cursor-pointer rounded-full mr-5 "
          />
        </div>
        <div>
          <h1 className="text-[17px] font-poppins font-[700]">
            {user.name.toUpperCase()}
          </h1>
          <p className="text-[16px] font-poppins font-[500]">{user.email}</p>
        </div>
      </div>
      <div className="border-[1px] border-[#00000014]  border-opacity-40 mt-2"></div>

     <div className="flex ">
     <div
        className={`  w-[50px] md:w-[310px] md:h-[450px] dark:bg-slate-900 bg-opacity-90  bg-white dark:border-[#ffffff1d]  dark:shadow-sm  mb-[80px] sticky left-[30px] border-r-[1px] border-[#00000014]  border-opacity-60 `}
      >
      <br />
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      {active === 1 && (
        <div className="  w-full ">
          <ProfileInfo  user={user} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full mt-5">
     <div className='grid grid-cols-1 justify-start items-center  mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  md:p-0 md:justify-start md:items-start md:mx-20 md:gap-10  xl:p-0 '>
        {ebooks.map((item:any) => (
          <EbookCard key={item.id} item={item} />
        ))}
      </div>
          {ebooks.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
              You don&apos;t have any purchased Book!
            </h1>
          )}
        </div>
      )}
        {active === 3 && (
        <div className="w-full mt-5">
          <div className="grid grid-cols-1 justify-start items-center gap-5  mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 lg:p-1 md:p-0 md:justify-start md:items-start md:mx-10 md:gap-[11rem] p-4">
          {courses &&
            courses.slice(0, 4).map((item, index) => {
              return <CourseCard item={item} key={index} />;
            })}
        </div>
          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
              You don&apos;t have any purchased courses!
            </h1>
          )}
        </div>
      )}
         {active === 4 && (
        <div className="w-full  mt-5">
          <EditProfileinfo  avatar={avatar} user={user} />
        </div>
      )}
      
     </div>

   

    
    </div>
  );
};

export default Profile;
