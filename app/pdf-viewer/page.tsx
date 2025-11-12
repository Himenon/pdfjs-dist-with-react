"use client";

import { useEffect, useState } from "react";
import {
  useDynamicRowHeight,
  useListRef,
  List as VariableSizeList,
} from "react-window";
import { Page } from "./_components/Page";
import PDFViewer from "./_components/PdfViewer";
import { usePDFPages } from "./_utils/usePDFPages";

const useReceivePDFData = () => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log(event.data);
      setPdfData(event.data);
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return pdfData;
};

function LoadedPDFDataViewer({ pdfData }: { pdfData: Uint8Array }) {
  const pdf = usePDFPages(pdfData);
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 600,
  });
  const [scale, setScale] = useState(1.0);
  const listRef = useListRef(null);
  return (
    <div>
      <div>
        <button type="button" onClick={() => setScale((prev) => prev - 0.2)}>
          Zoom Out
        </button>
        <button type="button" onClick={() => setScale((prev) => prev + 0.2)}>
          Zoom in
        </button>
        <button
          type="button"
          onClick={() => {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = "sample.pdf";
            link.click();
          }}
        >
          Download
        </button>
      </div>
      <div
        style={{
          width: "100%",
          height: "80vh",
          background: "#CCC",
        }}
      >
        {!pdf.loading && (
          <VariableSizeList
            listRef={listRef}
            rowCount={pdf.numPages}
            rowHeight={rowHeight}
            rowProps={{}}
            overscanCount={1}
            style={{
              padding: "16px 0 0 0",
            }}
            rowComponent={(props) => {
              const page = props.index + 1;
              pdf.fetchPageWithCache(page);
              return (
                <Page style={props.style}>
                  <PDFViewer pdfPage={pdf.pages[page]} scale={scale} />
                </Page>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function PDFViewerPage() {
  const pdfData = useReceivePDFData();
  if (pdfData) {
    return <LoadedPDFDataViewer pdfData={pdfData} />;
  }
  return <div>Loading....</div>;
}
