import Link from "next/link";
import React from "react";
//  laptop screen
export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "Books",
    url: "/ebook",
  },
  { name: "Blogs", url: "/blogs" },
];

// for mobile  screen 
export const navItemsDataMobile = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "Books",
    url: "/ebook",
  },
  { name: "Blogs", url: "/blogs" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
  { name: "Contact Us", url: "/contactUs" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData &&
          navItemsData.map((i, index) => (
            <Link href={`${i.url}`} key={index} passHref>
              <span
                className={`
                ${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[#3914dc] "
                    : "dark:text-white text-[#000000]"
                } 
                text-[17px] px-4  font-poppins font-[500] leading-2   
                hover:text-[#3914dc] 
              `}
              >
                {i.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref>
              <span
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
               TechEduCoder
              </span>
            </Link>
          </div>
          {navItemsDataMobile &&
            navItemsDataMobile.map((i, index) => (
              <Link href={`${i.url}`} key={index} passHref >
                <span
                  className={`${
                    activeItem === index
                      ? "dark:text-[#37a39a] text-[#3914dc] "
                      : "dark:text-white text-black"
                  } block py-2   text-[17px] px-4  font-poppins font-[500]   
                  hover:text-[#3914dc]  `}
                >
                  {i.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
