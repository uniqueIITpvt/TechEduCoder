import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
  import ControlPdf from './controlPdf';
  import 'react-pdf/dist/Page/TextLayer.css'; 
  import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  data: any;
};

const ShowEbook = ({data}: Props) => {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number>(0); // Specify the type of state variable
  const [pageNumber, setPageNumber] = useState<number>(1); // Specify the type of state variable

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) { // Specify the type of parameter
    setNumPages(numPages);
  }



  return (
    <div className="flex flex-col items-center w-full bg-black border-2 sm:flex-col sm:items-center sm:justify-start "
    >
     
      <ControlPdf
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          file={data.ebookpdf.url} 
          
        />
      <Document   className=" border-2 border-red-400" file={data.ebookpdf.url} onLoadSuccess={onDocumentLoadSuccess}>
        {/* {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={scale} 
          />
        ))} */}
        <Page pageNumber={pageNumber} scale={scale}   renderTextLayer={false}
            renderAnnotationLayer={false}/>
      </Document> 
    </div>
  );
};

export default ShowEbook;
