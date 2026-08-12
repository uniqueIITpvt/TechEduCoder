import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";

export default function DropDown() {
  return (
    <details className="group relative hidden 800px:block">
      <summary className="flex cursor-pointer list-none items-center px-5 text-[17px] font-Poppins font-[500] text-black hover:text-[#4c00ff] dark:text-white [&::-webkit-details-marker]:hidden">
        <span>Learn More</span>
        <IoMdArrowDropdown className="ml-1 transition-transform group-open:rotate-180" />
      </summary>
      <nav className="absolute left-3 top-full z-50 mt-2 min-w-[170px] rounded-lg bg-white py-2 shadow-lg dark:bg-slate-900">
        <Link
          href="/about"
          className="block px-5 py-3 text-[17px] font-Poppins font-[500] text-black hover:text-[#4c00ff] dark:text-white"
        >
          About
        </Link>
        <Link
          href="/policy"
          className="block px-5 py-3 text-[17px] font-Poppins font-[500] text-black hover:text-[#4c00ff] dark:text-white"
        >
          Policy
        </Link>
        <Link
          href="/faq"
          className="block px-5 py-3 text-[17px] font-Poppins font-[500] text-black hover:text-[#4c00ff] dark:text-white"
        >
          FAQ
        </Link>
        <Link
          href="/contactUs"
          className="block px-5 py-3 text-[17px] font-Poppins font-[500] text-black hover:text-[#4c00ff] dark:text-white"
        >
          Contact Us
        </Link>
      </nav>
    </details>
  );
}
