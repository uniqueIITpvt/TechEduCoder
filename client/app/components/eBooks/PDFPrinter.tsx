import React from 'react';
import { FaPrint } from "react-icons/fa";

interface PDFPrinterProps {
  file: string; // Assuming the file is a URL string
}

const PDFPrinter: React.FC<PDFPrinterProps> = ({ file }) => {
  const printPDF = async () => {
    try {
      // Fetch the PDF file as a Blob
      const response = await fetch(file);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const pdfFrame = document.createElement('iframe');
      pdfFrame.style.visibility = 'hidden';
      pdfFrame.src = blobUrl;
      document.body.appendChild(pdfFrame);

      pdfFrame.onload = () => {
        pdfFrame.contentWindow?.focus();
        pdfFrame.contentWindow?.print();
        document.body.removeChild(pdfFrame); // Cleanup after printing
        URL.revokeObjectURL(blobUrl); // Free up the Blob URL
      };
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };

  return (
    <div className="cursor-pointer" title="Print PDF" onClick={printPDF}>
      <FaPrint />
    </div>
  );
};

export default PDFPrinter;
