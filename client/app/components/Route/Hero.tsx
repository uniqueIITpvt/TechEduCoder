// You might need to adjust the import paths based on your project structure
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { FC } from "react";
import logo3 from "../../../public/1.jpg";
import logo1 from "../../../public/2.jpg";
import logo2 from "../../../public/3.jpg";
import logo4 from "../../../public/222222222222222.jpg";
import Link from "next/link";

type Props = {};
// Assuming the same imports and setup from your previous code

const Hero: FC<Props> = (props) => {
  return (
    <>
      <div className="w-full h-[50vh] md:h-auto">
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
            className="hidden md:block h-auto"

          >
            {/* Ensure your images are responsive */}
            <Image src={logo1} alt="" className="object-cover" />
            <Image src={logo3} alt="" className="object-cover" />
            <Image src={logo2} alt="" className="object-cover" />
            
          </Carousel>
          <Carousel
            swipeable={false}
            showArrows={true}
            infiniteLoop={true}
            autoPlay={true}
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={500}
            className="block md:hidden h-[50vh]"
            > 
            {/* Ensure your images are responsive */}
            <Image src={logo4} alt="" className=" h-[50vh] object-contain overflow-hidden " />
            <Image src={logo4} alt="" className=" h-[50vh] object-contain overflow-hidden" />
            <Image src={logo4} alt="" className=" h-[50vh] object-contain  overflow-hidden" />
            
          </Carousel> 
        

          <div className="absolute bottom-0 left-0 top-0 h-full md:w-[60%] w-[80%]  md:bg-gradient-to-r from-sky-500 md:pt-10 pl-2 md:pl-0">
            <h1 className=" text-[#0a083b] md:text-white text-[28px] md:text-[28px] md:ml-10 pl-4  leading-9  font-bold lg:ml-[5rem] lg:text-[48px]   lg:leading-[56px] lg:font-extrabold font-sans lg:mt-10 opacity-90 mt-8  ">
              Upgrade your learning Skills <br />& Upgrade your life
            </h1>
            {/* Hidden on mobile, visible on md screens and up */}
            <p className=" text-indigo-700 leading-[18px] pt-2  pl-4  text-[14px] font-[700] md:text-[17px] md:ml-9 md:font-[700] md:leading-[22px] lg:ml-20 lg:mt-6">
              Hand-picked Instructor and expertly crafted courses, designed for
              <br /> the modern students and entrepreneur.
            </p>
            <div className="flex mt-6  font-poppins font-[600] items-center justify-between ml-5 w-full  md:justify-start md:px-6  lg:ml-16  ">
              <div className="bg-gradient-to-r from-blue-500 to-[#521088] text-white rounded-lg  hover:bg-gradient-to-br p-3 text-sm transition-all ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 md:mr-6 lg:text-[16px] lg:p-4">
                <Link
                  href={`/courses`}
                  // className="  bg-gradient-to-r from-blue-500 to-[#521088]   text-center text-white rounded-lg hover:bg-gradient-to-br hover:text-white transition-all ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                  className=""
                >
                  Browse Courses
                </Link>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-[#521088] text-white rounded-lg  hover:bg-gradient-to-br p-3 text-sm transition-all ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 md:mr-6 lg:text-[16px] lg:p-4">
                <Link
                  href={`/courses`}

                  // className="bg-gradient-to-r from-blue-500 to-[#521088] items-center justify-center md:justify-start px-4 py-2 md:px-5 md:py-4 text-[17px] md:text-[18px] font-[500] text-center text-white rounded-lg hover:bg-gradient-to-br hover:text-white transition-all ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
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
