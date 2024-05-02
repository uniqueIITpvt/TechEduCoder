import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import logo from "../../public/TEC logo By UniqueIIT (1500 x 500 px) (1).svg";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { IoCall } from "react-icons/io5";
import {
  FaArrowRight,
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

import { TiSocialYoutube } from "react-icons/ti";
import { IoLogoYoutube } from "react-icons/io";
// import { FaXTwitter } from "react-icons/fa6";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
};

const Footer: FC<Props> = ({ setOpen, route, open, setRoute }) => {
  const { data } = useLoadUserQuery(undefined, {});

  return (
    <footer className="bg-gray-900 text-white ">
      <br />
      <div className="w-[90%] mx-auto ">
        <div className="md:grid md:grid-cols-3  md:gap-10 grid grid-cols-1  ">
          <div className=" col-span-1  mb-10  ">
            <div className="flex flex-col items-center justify-center">
              {" "}
              <div className="  w-[150px]  mb-5 border-2 border-white">
                <Link href={"/"}>
                  <Image src={logo} alt="" className="filter-invert" />
                </Link>
              </div>
              <div className="text-base  text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white">
                <p>
                  UNIQUEIIT is a Software development company specializes in
                  building custom software solutions for businesses of all
                  sizes. From web and mobile applications to cloud-based
                  systems, we have the skills and experience to bring your
                  project to life. Contact us today to discuss your software
                  needs.
                </p>{" "}
                <br />
                <Link href={`/about`}>
                  <div className=" flex items-center cursor-pointer text-[18px] ">
                    {" "}
                    <p>Read More</p>
                    <FaArrowRight />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className=" col-span-2 ">
            <div className=" grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 text-center md:text-start">
              <div className="space-y-3">
                <h3 className="text-[26px] text-white font-[700]  font-poppins ">
                  For Students
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/courses"
                      className="text-base text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white"
                    >
                      Courses
                    </Link>
                  </li>
                  <li>
                    {data?.user ? (
                      <Link
                        href={`/profile`}
                        className="text-base text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white cursor-pointer"
                      >
                        My Account
                      </Link>
                    ) : (
                      <div
                        onClick={() => setOpen(true)}
                        className="text-base text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white cursor-pointer"
                      >
                        My Account
                      </div>
                    )}
                  </li>
                  <li>
                    {data?.user ? (
                      <Link
                        href={`/profile`}
                        className="text-base text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white cursor-pointer"
                      >
                        Course Dashboard
                      </Link>
                    ) : (
                      <div
                        onClick={() => setOpen(true)}
                        className="text-base text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white cursor-pointer"
                      >
                        Course Dashboard
                      </div>
                    )}
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-[26px] font-[700]  font-poppins dark:text-white">
                  Social Links
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="https://www.youtube.com/channel/UCKJFJlEE6x4ZkN0WfvFMnPw"
                      className="text-base  font-[500] text-[17px] font-poppins dark:text-gray-300 dark:hover:text-white"
                    >
                      Youtube
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.instagram.com/techeducoder"
                      className="text-base  font-[500] text-[17px] font-poppins dark:text-gray-300 dark:hover:text-white"
                    >
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.facebook.com/profile.php?id=61558628114588"
                      className="text-base font-[500] text-[17px] font-poppins dark:text-gray-300 dark:hover:text-white"
                    >
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[26px] font-[700]   dark:text-white pb-3">
                  Contact Info
                </h3>

                <div className="flex  items-center justify-start mb-2">
                  <FaLocationDot />
                  <p className="text-base  dark:text-gray-300 dark:hover:text-white  ml-2">
                    Jaitpur Ext 2, New Delhi, India
                  </p>
                </div>
                <div className="flex  items-center justify-start mb-2">
                  <AiOutlineMail />
                  <p className="text-base dark:text-gray-300 dark:hover:text-white ml-2">
                    support@uniqueiit.com
                  </p>
                </div>
                <div className="flex  items-center justify-start mb-2">
                  <AiOutlineMail />
                  <p className="text-base dark:text-gray-300 dark:hover:text-white ml-2">
                    info@uniqueiit.com
                  </p>
                </div>
                <div className="flex  items-center justify-start mb-2">
                  <IoCall />
                  <p className="text-base dark:text-gray-300 hover-gradient ml-2">
                    +(91) 8877873229
                  </p>
                </div>

                <div className="flex mt-2 ">
                  <Link
                    href={`https://www.youtube.com/channel/UCKJFJlEE6x4ZkN0WfvFMnPw `}
                  >
                    <IoLogoYoutube
                      size={30}
                      className="mr-2 hover:text-[#521088]"
                    />
                  </Link>
                  <Link href={`https://www.instagram.com/techeducoder/`}>
                    {" "}
                    <FaInstagramSquare
                      size={30}
                      className="mr-2 hover:text-[#521088]"
                    />
                  </Link>
                  <Link
                    href={`https://www.linkedin.com/company/uniqueiitpvt/mycompany/`}
                  >
                    {" "}
                    <FaLinkedin
                      size={30}
                      className="mr-2 hover:text-[#521088]"
                    />
                  </Link>
                  <Link
                    href={`https://www.facebook.com/profile.php?id=61558628114588 `}
                  >
                    {" "}
                    <FaFacebookSquare
                      size={30}
                      className="mr-2 hover:text-[#521088]"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <p className="text-center  dark:text-white">
          Copyright ©2024 UniqueIIT | All Rights Reserved
        </p>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
