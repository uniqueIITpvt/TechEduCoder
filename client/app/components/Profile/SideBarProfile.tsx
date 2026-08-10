import React, { FC } from "react";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";
import { FaUser, FaUserEdit } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: any;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}) => {
  return (
    <div className="w-full ">
      <div
        className={`w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-md ${
          active === 1
            ? "dark:bg-slate-800 bg-gradient-to-r from-blue-500 to-[#521088]  text-white"
            : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <FaUser />
        <h5 className="hidden md:block pl-2 font-Poppins  text-[17px] font-poppins font-[500] ">
          My Profile
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-md ${
          active === 2
            ? "dark:bg-slate-800 bg-gradient-to-r from-blue-500 to-[#521088]  text-white"
            : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <IoBookSharp size={20} className="dark:text-white text-black" />
        <h5 className=" hidden md:block pl-2 font-Poppins  text-[17px] font-poppins font-[500] ">
          My Books
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-md ${
          active === 3
            ? "dark:bg-slate-800 bg-gradient-to-r from-blue-500 to-[#521088]  text-white"
            : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="dark:text-white text-black" />
        <h5 className=" hidden  md:block  pl-2 font-Poppins  text-[17px] font-poppins font-[500] ">
          Enrolled Courses
        </h5>
      </div>
    
      <div
        className={`w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-md ${
          active === 4
            ? "dark:bg-slate-800 bg-gradient-to-r from-blue-500 to-[#521088]  text-white"
            : "bg-transparent"
        }`}
        onClick={() => setActive(4)}
      >
        <FaUserEdit size={20} className="dark:text-white text-black" />
        <h5 className=" hidden md:block pl-2 font-Poppins  text-[17px] font-poppins font-[500] ">
          Edit Profile
        </h5>
      </div>
      {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-md ${
            active === 5
              ? "dark:bg-slate-800 bg-gradient-to-r from-blue-500 to-[#521088]  text-white"
              : "bg-transparent"
          }`}
          href={"/admin"}
        >
          <MdOutlineAdminPanelSettings
            size={20}
            className="dark:text-white text-black"
          />
          <h5 className=" hidden md:block pl-2 font-Poppins  text-[17px] font-poppins font-[500] ">
            Admin Dashboard
          </h5>
        </Link>
      )}
      <div
        className={`w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-200 rounded-md ${
          active === 6
            ? "dark:bg-slate-800 bg-gradient-to-r from-blue-500 to-[#521088]  text-white"
            : "bg-transparent"
        }`}
        onClick={() => logOutHandler()}
      >
        <AiOutlineLogout size={20} className="dark:text-white text-black" />
        <h5 className=" hidden  md:block pl-2 font-Poppins  text-[17px] font-poppins font-[500] ">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
