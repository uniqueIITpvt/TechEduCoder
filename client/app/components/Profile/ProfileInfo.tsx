import Image from "next/image";
import { styles } from "../../styles/style";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assests/avatar.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";
import { format } from "timeago.js";

type Props = {
  user: any;
};

const ProfileInfo: FC<Props> = ({ user }) => {
  return (
    <>
      <div className="w-[90%] mx-auto flex justify-start">
        <div className="">
          <h5 className="md:pl-8 font-Poppins  text-[27px] font-poppins font-[700] mt-5  opacity-80  ml-2">
            My Profile
          </h5>
          <h5 className="md:pl-8 font-Poppins  text-[17px] font-poppins font-[500] md:px-4 py-2 opacity-95">
            Name:<span className=" md:ml-[6rem]"> {user.name}</span>{" "}
          </h5>
          <h5 className="md:pl-8 font-Poppins  text-[17px] font-poppins font-[500] md:px-4  py-2">
            Email:    <span className=" md:ml-[6rem]"> {user.email}</span>
          </h5>
          <h5 className=" md:pl-8 font-Poppins  text-[17px] font-poppins font-[500]  md:px-4 py-2">
            Join At:   <span className=" md:ml-[6rem]">{format(user.createdAt)}</span>
          </h5>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
