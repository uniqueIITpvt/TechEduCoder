import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

export default function DropDown() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="   hidden 800px:flex text-[17px] px-5 font-Poppins font-[500]  leading-2 dark:text-white text-black cursor-pointer hover:text-[#4c00ff]">
          {" "}
          <p>Learn More </p>{" "}
          <span className="pt-1">
            <IoMdArrowDropdown />
          </span>{" "}
        </div>
      </DropdownTrigger>
      <DropdownMenu className="p-1  pb-6 bg-white   rounded-lg">
        <DropdownItem key="about">
          <Link
            href={`/about`}
            className="text-[17px] px-4 py-5 hover:text-[#4c00ff]  by-1 font-Poppins font-[500]  dark:text-white text-black  p-3"
          >
            About
          </Link>
        </DropdownItem>
        <DropdownItem key="policy">
          {" "}
          <Link
            href={`/policy`}
            className="text-[17px] py-4 hover:text-[#4c00ff] px-5 font-Poppins font-[500] dark:text-white text-black"
          >
            Policy
          </Link>
        </DropdownItem>
        <DropdownItem key="faq">
          {" "}
          <Link
            href={`/faq`}
            className="text-[17px] py-4 hover:text-[#4c00ff] px-5 font-Poppins font-[500] dark:text-white text-black"
          >
            FAQ
          </Link>
        </DropdownItem>
        <DropdownItem key="contact">
          <Link
            href={`/contactUs`}
            className='text-[17px] hover:text-[#4c00ff] px-5  py-5 font-Poppins font-[500] "dark:text-white text-black" '
          >
            Contact Us{" "}
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
