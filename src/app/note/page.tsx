'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<Error | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function onError(error: Error): void {
    setError(error);
  }

  if (error) {
    return <div>Error loading PDF: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setScale(scale + 0.2)}
        >
          Zoom In
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setScale(Math.max(0.2, scale - 0.2))}
        >
          Zoom Out
        </button>
      </div>

      <div className="border rounded-lg shadow-lg p-4">
        <Document
          file="/pdfs/note.pdf" // Replace with your PDF file path
          onLoadSuccess={onDocumentLoadSuccess}
          onError={onError}
          className="max-w-full"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
