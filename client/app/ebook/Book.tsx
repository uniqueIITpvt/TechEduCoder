import React, { useEffect, useState } from "react";

import { useGetAllEbooksQuery } from "../../redux/features/ebook/ebooksApi";
import EbookCard from "../components/EbookCard/EbookCard";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = {};
const Book = (props: Props) => {
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(2);
  const [open, setOpen] = useState(false);
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
      setEbooks(data.ebooks.slice(0, 4));
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
    <br />
    <br />
       <div className="w-[90%] m-auto justify-center flex items-center flex-wrap">
              <div
                className={`${
                  category === "All" ? "bg-[#284aa7] text-white" : "bg-[#eaeaf0] shadow-lg text-black"
                } m-3   rounded-lg flex items-center justify-center font-Poppins p-3 px-4 cursor-pointer text-xl font-[600]`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`${
                        category === item.title
                          ? "bg-[#284aa7] text-white"
                          : "bg-[#eaeaf0] shadow-lg text-black"
                        } m-3   rounded-lg flex items-center justify-center font-Poppins p-3 px-4 cursor-pointer text-xl font-[600] hover:bg-slate-400`}

                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>

      <br />
      <br />
      <div className="grid grid-cols-1  p-2 items-center gap-10  mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:justify-start md:items-start md:mx-20 md:gap-10">
        { books && books.map((item) => (
          <EbookCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default Book;
