import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import ControlPdf from "./controlPdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  data: any;
};

const ShowEbook = ({ data }: Props) => {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number>(0); // Specify the type of state variable
  const [pageNumber, setPageNumber] = useState<number>(1); // Specify the type of state variable

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    // Specify the type of parameter
    setNumPages(numPages);
  }

  return (

    < >
      <div className="flex flex-col items-center w-full bg-black border-2 sm:flex-col sm:items-center sm:justify-start ">
      <ControlPdf
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          file={data.ebookpdf.url}
        />
      </div>
      <div className="flex flex-col items-center w-full bg-black border-2  p-4 sm:flex-col sm:items-center sm:justify-start ">
       
        <Document
          className=" border-2 border-red-400 bg-black"
          file={data.ebookpdf.url}
          onLoadSuccess={onDocumentLoadSuccess}
        >
           {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => {
            return (
              <Page className={`p-4 shadow-lg`}
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            );
          })}
          {/* <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          /> */}
        </Document>
      </div>
  
  
    </>
  
    );
};

export default ShowEbook;