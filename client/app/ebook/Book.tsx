import React, { useEffect, useState } from "react";

import { useGetAllEbooksQuery } from "../../redux/features/ebook/ebooksApi";
import EbookCard from "../components/EbookCard/EbookCard";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = {};
const Book = (props: Props) => {

  const [category, setCategory] = useState("All");
  const [books ,setBooks] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const { isLoading, data, refetch } = useGetAllEbooksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});

  useEffect(() => {
    if (data) {
      // Slice the first 4 ebooks from the data and set them to state
      setEbooks(data.ebooks);
    }
  }, [data]);
  
  
  useEffect(() => {
    if (category === "All") {
      setBooks(data?.ebooks);
    }
    if (category !== "All") {
      setBooks(
        data?.ebooks.filter((item: any) => item.category === category)
      );
    }
   
  }, [data, category]);
  const categories = categoriesData?.layout.categories;



  return (
    <>
  
    <br />
       <div className="w-[90%] m-auto justify-center flex items-center flex-wrap">
              <div
               className={`${
                category === "All" ? "bg-gradient-to-r from-blue-500 to-[#521088] text-white" : "bg-white  text-black opacity-80 "
              }  m-1   rounded-full flex items-center justify-center font-Poppins p-2 px-3 cursor-pointer text-[16px] font-[500] hover:bg-gradient-to-r from-blue-500 to-[#521088] hover:text-white`}
                onClick={() => setCategory("All")}
              >
                All books
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                       className={`${
                        category === item.title
                          ? "bg-gradient-to-r from-blue-500 to-[#521088] text-white"
                          : " text-black"
                        } m-1   rounded-full flex items-center justify-center font-Poppins p-2 px-3 cursor-pointer text-[16px] font-[500] hover:bg-gradient-to-r from-blue-500 to-[#521088] hover:text-white opacity-80`}


                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>

      <br />
      <br />
      <div className="grid grid-cols-1 items-center gap-10  mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  justify-center md:justify-start md:items-start md:mx-20 md:gap-10">
        { books && books?.map((item) => (
          <EbookCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default Book;
