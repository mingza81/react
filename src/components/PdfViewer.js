import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Button from 'react-bootstrap/Button';

// ตั้งค่า worker สำหรับ pdf.js จาก CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // โหลดหมายเลขหน้าจาก localStorage เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const savedPageNumber = localStorage.getItem('pageNumber');
    console.log("Loaded page number from localStorage:", savedPageNumber);
    if (savedPageNumber) {
      const parsedPageNumber = parseInt(savedPageNumber, 10);
      if (!isNaN(parsedPageNumber)) {
        setPageNumber(parsedPageNumber);
      }
    }
    setLoading(false);
  }, []);

  // บันทึกหมายเลขหน้าไปยัง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (!loading) {
      console.log("Saving page number to localStorage:", pageNumber);
      localStorage.setItem('pageNumber', pageNumber);
    }
  }, [pageNumber, loading]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Button variant="success" onClick={goToPrevPage} disabled={pageNumber <= 1}>
          Previous
        </Button>
        <span> Page {pageNumber} of {numPages} </span>
        <Button variant="success" onClick={goToNextPage} disabled={pageNumber >= numPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PdfViewer;
