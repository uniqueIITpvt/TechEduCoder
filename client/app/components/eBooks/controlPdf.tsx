import { useEffect, useRef, useState } from "react";
// import React {useState useEffect useRef} from 'react';
// import PDFPrinter from '../components/PDFPrinter'; // Adjust the import path as necessary
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { FaBackward } from "react-icons/fa";
import { FaForward } from "react-icons/fa";
import PDFPrinter from './PDFPrinter';
import { IoMdDownload } from "react-icons/io";
import Link from "next/link";
interface Props {
  file: string;
  pageNumber: number;
  numPages: number;
  setPageNumber: (pageNumber: number) => void;
  scale: number;
  setScale: (scale: number) => void;
}


const ControlPdf: React.FC<Props> = ({
  file,
  pageNumber,
  numPages,
  setPageNumber,
  scale,
  setScale,
}) => {
  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;
  console.log(scale)
  const goToFirstPage = () => !isFirstPage && setPageNumber(1);
  const goToPreviousPage = () => !isFirstPage && setPageNumber(pageNumber - 1);
  const goToNextPage = () => !isLastPage && setPageNumber(pageNumber + 1);
  const goToLastPage = () => !isLastPage && setPageNumber(numPages);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isBottom = scrollHeight - scrollTop === clientHeight;
    const isTop = scrollTop === 0;

    if (isBottom && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    } else if (isTop && pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('scroll', onScroll);
    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [pageNumber, numPages, onScroll]);

  const onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => setPageNumber(Number(e.target.value));

  const isMinZoom = scale < 0.6;
  const isMaxZoom = scale >= 2.0;

  return (
   <div className=" fixed z-[80] top-20 p-5    items-center justify-center flex  w-full  bg-slate-200">
     <div className="flex justify-between w-[50%]  ">
      <div className="flex justify-between items-center">
        {/* <button 
          className={`mx-3 ${isFirstPage ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'} `} 
          onClick={goToFirstPage} 
          disabled={isFirstPage}
        > <FaBackward /></button> */}
        
        <button 
          className={`mx-3 ${isFirstPage ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'} fas fa-backward`} 
          onClick={goToPreviousPage} 
          disabled={isFirstPage}
        ><FaBackward size={15}/></button>
        <span className="hidden lg:flex">
          Page{' '}
          <input
            name="pageNumber"
            type="number"
            min="1"
            max={numPages.toString()}
            className="text-center mx-2 w-16  hidden lg:text-centetr lg:flex "
            value={pageNumber}
            onChange={onPageChange}
          />{' '}
          of {numPages}
        </span>
        <button 
          className={`mx-3 ${isLastPage ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'}`} 
          onClick={goToNextPage}
          disabled={isLastPage}
        >
        
        < FaForward size={15}/></button>

        {/* <button 
          className={`mx-3 ${isLastPage ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'}`} 
          onClick={goToLastPage}
          disabled={isLastPage}
        >< FaBackward/></button> */}
      </div>
      <div className="flex items-baseline">
        <button 
          className={`mx-3 ${isMinZoom ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'} `} 
          onClick={() => setScale(scale - 0.1)} 
          disabled={isMinZoom}
        ><CiCircleMinus size={20}/></button>
        <span>{(scale * 100).toFixed()}%</span>
        <button 
          className={`mx-3 ${isMaxZoom ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'} `} 
          onClick={() => setScale(scale + 0.1)} 
          disabled={isMaxZoom}
        >
       < CiCirclePlus size={20} /></button>
      </div>
      <div className="mx-3">
        <Link href={file} download={true} title="download" className="text-blue-500 hover:text-blue-700">
       <button><IoMdDownload size={20}/></button>
        </Link>
      </div>
      <div className="mx-3">
      
        <PDFPrinter file={file} />
      </div>
    </div>
   </div>
  );
};

export default ControlPdf;

