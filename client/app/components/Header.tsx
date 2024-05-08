"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import logo from "../../public/TEC logo By UniqueIIT (1500 x 500 px) (1).svg";
// import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";
import Dropdown from "../utils/DropDown";
import { AiOutlineSearch } from "react-icons/ai";
import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogsApi";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {});
  const { data: blogData } = useGetAllBlogsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: course } = useGetUsersAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  // const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!isLoading) {
      // if (!userData) {
      //   if (data) {
      //     socialAuth({
      //       email: data?.user?.email,
      //       name: data?.user?.name,
      //       avatar: data.user?.image,
      //     });
      //     refetch();
      //   }
      // }
      // if (data === null) {
        if (isSuccess) {
          toast.success("Login Successfully");
        }
      // }
      if (!isLoading && !userData) {
        setLogout(true);
      }
    }
  }, [ userData, isLoading]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };

  const [activeSearch, setActiveSearch] = useState<string[]>([]);

  const handleSearch = (e: any) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      setActiveSearch([]);
      return;
    }
    setActiveSearch(
      course?.courses
        .filter((course: any) => course.name.toLowerCase().includes(searchTerm))
        .slice(0, 8)
    );
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full relative">
          <div
            className={`${
              active
                ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                : "w-full dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
            }`}
          >
            <div className="w-[95%] 800px:w-[92%] m-auto h-full">
              <div className="w-full h-[80px] flex items-center justify-between px-3">
              <div className="w-[5rem] md:w-[10rem]">
    <Link href="/">
        <Image 
            src={logo} 
            alt="Logo Description"
            width={500} // Adjust based on the actual size of the SVG for best quality
            height={160} // Adjust based on the actual aspect ratio of the SVG
            priority={true}
        />
    </Link>
</div>


                <div className=" bg-transparent relative px-2  w-[18rem]  md:w-[30rem] ">
                  <AiOutlineSearch
                    size={20}
                    className="absolute right-4 top-2 cursor-pointer text-black"
                  />
                  <input
                    type="search"
                    placeholder="Search Courses..."
                    onChange={handleSearch}
                    className="bg-gray-100  text-black  placeholder:text-[17px]  w-full  placeholder:text-slate-900  rounded-[7px] p-2  h-[40px] outline-none font-[400] font-poppins"
                  />

                  {activeSearch?.length > 0 && (
                    <div className="absolute w-full  bg-slate-50 shadow-sm-2 rounded-xl z-[9] p-4 ">
                      { activeSearch && activeSearch.map((course: any) => (
                        <Link href={`/course/${course._id}`} key={course._id}>
                          <p className="cursor-pointer p-2 hover:bg-gray-300 text-black rounded-sm border-b-2 text-[16px]  shadow-sm leading-[1.2] ">
                            {course.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <NavItems activeItem={activeItem} isMobile={false} />
                  <Dropdown />

               
                  <div className="800px:hidden">
                    <HiOutlineMenuAlt3
                      size={25}
                      className="cursor-pointer dark:text-white text-black"
                      onClick={() => setOpenSidebar(true)}
                    />
                  </div>
                  {userData ? (
                    <Link href={"/profile"}>
                      <Image
                        src={
                          userData?.user.avatar
                            ? userData.user.avatar.url
                            : avatar
                        }
                        alt=""
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] rounded-full cursor-pointer md:hidden  lg:block "
                        style={{
                          border:
                            activeItem === 5 ? "2px solid #37a39a" : "none",
                        }}
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={25}
                      className="hidden 800px:block cursor-pointer dark:text-white text-black"
                      onClick={() => setOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* mobile sidebar */}
            {openSidebar && (
              <div
                className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                onClick={handleClose}
                id="screen"
              >
                <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                  <NavItems activeItem={activeItem} isMobile={true} />
             <div className="ml-5">
             {userData?.user ? (
                    <Link href={"/profile"}>
                      <Image
                        src={
                          userData?.user.avatar
                            ? userData.user.avatar.url
                            : avatar
                        }
                        alt=""
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] rounded-full ml-[20px] cursor-pointer"
                        style={{
                          border:
                            activeItem === 5 ? "2px solid #37a39a" : "none",
                        }}
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={25}
                      className="800px:block cursor-pointer dark:text-white text-black"
                      onClick={() => {
                        setOpen(true);
                        setOpenSidebar(false);
                      }}
                     
                    
                    />
                  )}
             </div>
                  <br />
                  <br />
                  <p className="text-[17px] px-2 pl-5 text-black dark:text-white">
                    Copyright @2024  By UniqueIIT
                  </p>
                </div>
              </div>
            )}
          </div>
          {route === "Login" && (
            <>
              {open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Login}
                  refetch={refetch}
                />
              )}
            </>
          )}

          {route === "Sign-Up" && (
            <>
              {open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={SignUp}
                />
              )}
            </>
          )}

          {route === "Verification" && (
            <>
              {open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Verification}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
