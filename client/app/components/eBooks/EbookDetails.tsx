import { styles } from "@/app/styles/style";
// import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { AiOutlineUnorderedList } from "react-icons/ai";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const ShowEbook = dynamic(() => import("./ShowEbook"), { ssr: false });

type Props = {
  data: any;

  setRoute: any;
  setOpen: any;
};

const EbookDetails = ({
  data,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [activeBar, setactiveBar] = useState(0);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const handlePayment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
      toast.error("Razorpay SDK Failed to load");
      return;
    }

    const amount = Math.round(data.discountPrice * 100);
    const currency = "INR";
    const userId = user?._id;

    try {
      const response = await fetch(
        "https://techeducoder-lrel.onrender.com/api/v1/create-BookOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            bookId: data._id,
            userId,
          }),
        }
      );

      const data1 = await response.json();
      if (!response.ok) {
        toast.error( "this is",  data1.message);
      } 
     


      var options = {
        key: process.env.KEY,
        name: "book Payment",
        currency: currency,
        amount: amount,
        order_id: data1.orderId,
        description: "Thank you for purchasing my books",
        handler: async function (response: any) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          try {
            const validationResponse = await fetch(
              "https://techeducoder-lrel.onrender.com/api/v1/validateBookOrder",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                }),
              }
            );
            const validationData = await validationResponse.json();
            if (validationData.success) {
              toast.success("Payment verification successful");
              refetch(); 
              setUser({ ...user, book: [...user.books, { _id: data._id }] }); // Update locally without refetching if possible
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            toast.error("Error" , error.message);
          }
        },
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
          paylater: false,
        },
        prefill: {
          name: "tanwir alam",
          email: "tanw9004167@gmail.com",
          contact: "9835471132",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred during the payment process"
      );
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleOrder = (e: any) => {
    e.preventDefault(); 
    if (user) {
      handlePayment(); 
    } else {
      setRoute("Login"); 
      openAuthModal(true); 
    }
  };
  const dicountPercentenge =
  ((data?.originalPrice - data.discountPrice) / data?.originalPrice) * 100;

const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased =
    user && user?.books?.find((item: any) => item._id === data._id);

  return (
    <div className=" w-full ">
      <div className="w-[90%] m-auto  mt-10  mb-20">
        <div className="w-full  ">
          <div className="">
            {" "}
            <h1 className="text-[26px] font-[700] font-poppins   m-3  truncate...">
              {data.ebookTitle}
            </h1>
          </div>
          <div className=" w-full flex justify-between font-poppins ">
            <h3 className="m-2 text-[17px] font-poppins font-[400] opacity-80">
              <span className="text-gray-700">category: </span>{" "}
              <Link href={`/course`}>{data.category}</Link>
            </h3>
            <div className="flex justify-between">
              <Link href={`/`} className=" md:px-10 px-2   ">
                {" "}
                <div className="flex items-center px-3">
                  <MdOutlineContentCopy size={20} />
                  <h3 className="text-[16px] font-poppins font-[400] dark:text-white text-black mx-1 opacity-80  ">
                    WhishList{" "}
                  </h3>
                </div>{" "}
              </Link>
              <Link href={`/`} className="px-2">
                {" "}
                <div className="flex px-2 items-center opacity-80 ">
                  <IoIosShareAlt size={30} />
                  <h3 className="text-[16px] font-poppins font-[400] dark:text-white text-black mx-1">
                    Share{" "}
                  </h3>
                </div>{" "}
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 ">
            {/* course content  */}

            <div className=" mb-10 flex items-center justify-center">
              <Image
                src={data.thumbnail.url}
                width={500}
                height={300}
                className="rounded-t-lg object-cover"
                alt=""
              />
            </div>
            <div className="w-full p-4  flex items-center justify-start  border-b-2 border-[#e4e6ee]  backdrop-blur shadow-[bg-slate-700]  rounded shadow-inner">
              {["Overview"].map((text, index) => (
                <h5
                  key={index}
                  className={`800px:text-[20px] cursor-pointer ${
                    activeBar === index
                      ? "text-[#3e64de] border-b-2 border-[#3e64de] "
                      : "dark:text-white text-black"
                  } mr-10`}
                  onClick={() => setactiveBar(index)}
                >
                  {text}
                </h5>
              ))}
            </div>
            {activeBar === 0 && (
              <div>
                <div className="w-full border-1 border-[#e4e6ee] m-2">
                  <h1 className="text-[26px] font-[700] dark:text-white text-black font-poppins opacity-80">
                    About Books{" "}
                  </h1>
                  <h2 className="text-[17px] font-poppins  font-[500] mt-5 dark:text-white   text-black opacity-80">
                    {data.aboutEbooks}
                  </h2>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="w-full m-auto shadow-md rounded-lg border-[1px] border-[#565658] ">
              <div className=" w-full   bg-[#d5e5fd] flex  flex-col  items-center p-12 rounded-t-lg ">
                <div className=" flex w-full  ">
                  <h3 className=" text-[25px] text-black dark:text-white font-[700] font-poppins mx-3 ">
                    {data.originalPrice === 0
                      ? "Free"
                      : "₹" + data.originalPrice}{" "}
                  </h3>
                  <p className="text-[17px] line-through opacity-60 text-red-400 dark:text-white mx-3">
                    {data.originalPrice === 0 ? " " : "₹" + data.discountPrice.toFixed(2)}
                  </p>

                  <p className="text-[17px] text-[#3539fa] dark:text-white  font-[400] ">
                    {data.originalPrice === 0
                      ? ""
                      : discountPercentengePrice + "% off"}
                  </p>
                </div>
                <div className="flex items-center mt-5 w-full justify-center">
                  {isPurchased ? (
                    <Link
                      className={`${styles.button} !w-full !justify-center`}
                      // className=" rounded-lg p-5 text-[#ffffff] py-2 font-[500] font-poppins text-[17px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br "
                      href={`/eBook-access/${data._id}`}
                    >
                      Read Ebook
                    </Link>
                  ) : (
                    <div
                      className={`${styles.button} !w-full !items-center !justify-center`}
                      // className=" rounded-md text-[#ffffff] py-2 px-2 font-[500] font-poppins text-[18px] bg-gradient-to-r  flex justify-center hover:bg-sky-700 hover:text-gradient-to-r from-blue-500 to-[#521088]   hover:bg-gradient-to-br hover:text-white  delay-100 bg-blue-500   duration-200 cursor-pointer"
                      onClick={handleOrder}
                    >
                      Buy Now
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full m-6 leading-8 ">
                <div className="flex   items-center ">
                  <Ratings rating={data?.ratings} />

                  <h5 className="text-[20px] font-Poppins text-black dark:text-white">
                    ({" "}
                    {Number.isInteger(data?.ratings)
                      ? data?.ratings.toFixed(1)
                      : data?.ratings.toFixed(2)}{" "}
                    )
                  </h5>
                </div>
                <h1 className="text-[16px]  flex dark:text-white text-black font-[400] font-poppins items-center ">
                  <span className="mr-2">
                    <SiLevelsdotfyi />
                  </span>
                  {data.level}
                </h1>
                <h1 className="text-[16px]  flex items-center  dark:text-white text-black font-[400] font-poppins ">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <FaGraduationCap />
                  </span>{" "}
                  {data.purchased} Students Purchased
                </h1>

                <h1 className="text-[17px]  flex items-center  dark:text-white text-black font-[400] font-poppins mb-2 ">
                  {" "}
                  <span className="mr-2">
                    {" "}
                    <RxUpdate />{" "}
                  </span>
                  {format(data.createdAt)}
                </h1>
              </div>
            </div>
            <div className="w-[80%] m-auto ">
              <h1 className="text-[27px] font-[700]  dark:text-white text-black font-poppins m-4">
                {/* Materials Included?{" "} */}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookDetails;
