// You might need to adjust the import paths based on your project structure
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { FC } from "react";
import logo3 from "../../../public/1.jpg";
import logo1 from "../../../public/2.jpg";
import logo2 from "../../../public/3.jpg";
import Link from "next/link";

type Props = {};
// Assuming the same imports and setup from your previous code

const Hero: FC<Props> = (props) => {
  return (
    <>
      <div className="w-full h-auto">
        <div className="relative">
          <Carousel
            swipeable={false}
            showArrows={true}
            infiniteLoop={true}
            autoPlay={true}
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={500}
          >
            {/* Ensure your images are responsive */}
            <Image src={logo1} alt="" layout="responsive" />
            <Image src={logo3} alt="" layout="responsive" />
            <Image src={logo2} alt="" layout="responsive" />
          </Carousel>

          <div className="absolute bottom-0 left-0 top-0 h-full w-[60%] bg-gradient-to-r from-sky-500 md:pt-10 pl-2 md:pl-0">
            <h1 className="text-white text-[20px]  leading-7 pl-8 md:pt-5 pt-2 font-[700] xl:pt-20 xl:pl-16  lg:text-[40px] lg:pl-10    md:text-[25px]  md:pl-4   sm:ml-[30px] sm:pl-[10px] sm:mb-[10px sm:font-[700]]   ">
              Upgrade your learning <br /> Skills & Upgrade your life
            </h1>
            {/* Hidden on mobile, visible on md screens and up */}
            <p className="hidden  lg:block lg:pl-16 xl:pl-24  text-indigo-700 leading-7 pt-2  pl-2  text-[18px] md:text-[20px] md:hidden font-[700]">
              Hand-picked Instructor and expertly crafted courses, designed for
              <br /> the modern students and entrepreneur.
            </p>
            <div className="flex py-2 md:hidden pl-2 md:pl-10 lg:flex lg:mt-5 xl:pl-20">
              <div className="p-2 md:p-3">
                <Link
                  href={`/courses`}
                  className="hidden md:hidden lg:block  bg-gradient-to-r from-blue-500 to-[#521088] items-center justify-center md:justify-start px-4 py-2 md:px-5 md:py-4 text-[17px] md:text-[18px] font-[500] text-center text-white rounded-lg hover:bg-gradient-to-br hover:text-white transition-all ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                >
                  Browse Courses
                </Link>
              </div>
              <div className="p-2 md:p-3">
                <Link
                  href={``}
                  className="hidden md:inline-flex bg-gradient-to-r from-blue-500 to-[#521088] items-center justify-center md:justify-start px-4 py-2 md:px-5 md:py-4 text-[17px] md:text-[18px] font-[500] text-center text-white rounded-lg hover:bg-gradient-to-br hover:text-white transition-all ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
