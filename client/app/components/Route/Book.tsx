import React, { useEffect, useState } from "react";


// import { useGetAllEbooksQuery } from "../../redux/features/ebook/ebooksApi";
// import { useGetEbookQuery } from "../../redux/features/ebook/ebooksApi";
import EbookCard from "../../components/EbookCard/EbookCard";
import { styles } from "@/app/styles/style";
import { useGetAllEbooksQuery } from "@/redux/features/ebook/ebooksApi";
import {IoIosArrowDroprightCircle} from 'react-icons/io'
import Link from "next/link";

type Props = {};
const Book = (props: Props) => {
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(2);
  const [open, setOpen] = useState(false);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const { isLoading, data, refetch } = useGetAllEbooksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data) {
      // Slice the first 4 ebooks from the data and set them to state
      setEbooks(data.ebooks.slice(0, 4));
    }
  }, [data]);

  return (
    <div
     className="bg-slate-200 pb-28 pt-10">
      <br />

      <div className="relative" >
      <h1 className={`${styles.title} 800px:!text-[45px] text-gradient pt-10`}>
        {/* Get in */}
        <span className='text-gradient'>Uncover <br /> The Future with Our Tech Bookshelf</span>
      </h1>
      
      <h2 className='800px:!text-[20px] text-[18px] text-black dark:text-white font-[700] font-Poppins text-center py-2 mx-5'>"Technology is not just a tool. It can give learners a voice that they may not have had before." - George Couros</h2>

      <br />
      <br />
      <div className='grid grid-cols-1 justify-start items-center gap-10  mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:p-1 md:p-0 md:justify-start md:items-start md:mx-20 md:gap-10 p-10'>
        {ebooks.map((item) => (
          <EbookCard key={item.id} item={item} />
        ))}
      </div>
      <Link href={`/ebook`} className="absolute bottom-60  z-9999 right-10  hover:translate-x-2 hover:translate-y- transition duration-300"><IoIosArrowDroprightCircle  size={50}/></Link>
     
      </div>

    </div>
  );
};

export default Book;
