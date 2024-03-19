import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo from "../../public/TEC logo By UniqueIIT (1500 x 500 px) (1).svg";
import { styles } from "../styles/style";

type Props = {};

const Footer = (props: Props) => {
  return (
    
    <footer className="bg-gray-900 text-white">
      <div className="border border-[#4745450e] dark:border-[#ffffff1e]" />

      <div className="w-[95%]  800px:max-w-[95%] mx-auto  sm:px-6 ">
        <div className="md:grid md:grid-cols-3 gap-4  grid grid-cols-1  mt-20">
          <div className=" col-span-1  ">
            <div className="  w-[150px]  mb-5">
              <Link href={"/"}>
                <Image src={logo} alt="" className="filter-invert" />
              </Link>
            </div>

            <div className="text-base  text-white font-poppins font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white mr-10">
              <p>
                  UNIQUEIIT is a Software development company specializes in
                building custom software solutions for businesses of all sizes.
                From web and mobile applications to cloud-based systems, we have
                the skills and experience to bring your project to life. Contact
                us today to discuss your software needs.
              </p>
            </div>
          </div>
          <div className=" col-span-2 ">
            <div className=" grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 text-center md:text-start">
              <div className="space-y-3">
                <h3 className="text-[26px] text-white font-[700]  font-poppins ">
                  Quick Links
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
                    <Link
                      href="/profile"
                      className="text-base   font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/course"
                      className="text-base text-[17px]font-[500] font-poppins  dark:text-gray-300 dark:hover:text-white"
                    >
                      Course Dashboard
                    </Link>
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
                      href=""
                      className="text-base  font-[500] text-[17px] dark:text-gray-300 dark:hover:text-white"
                    >
                      Youtube
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="text-base  font-[500] text-[17px] font-poppins dark:text-gray-300 dark:hover:text-white"
                    >
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="text-base font-[500] text-[17px] font-poppins dark:text-gray-300 dark:hover:text-white"
                    >
                      github
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[26px] font-[700]   dark:text-white pb-3">
                  Contact Info
                </h3>
                <p className="text-base  dark:text-gray-300 dark:hover:text-white pb-2">
                  Call Us: 9835471132
                </p>

                <p className="text-base  dark:text-gray-300 dark:hover:text-white pb-2">
                  Address: jait pur
                </p>

                <p className="text-base dark:text-gray-300 dark:hover:text-white  pb-2">
                  Mail Us: tanw9004167@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <p className="text-center  dark:text-white">
          Copyright © 2024 UniqueIIT | All Rights Reserved
        </p>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
