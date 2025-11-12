"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useDynamicRowHeight,
  useListRef,
  List as VariableSizeList,
} from "react-window";
import { Page } from "./_components/Page";
import PDFViewer from "./_components/PdfViewer";
import { usePDFPages } from "./_utils/usePDFPages";

const useReceivePDFData = (): [string, Uint8Array<ArrayBufferLike> | null] => {
  const [filename, setFilename] = useState<string>("");
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as {
        chunk: ArrayBuffer;
        filename: string;
      };
      setPdfData(new Uint8Array(data.chunk));
      setFilename(data.filename);
    };
    window.addEventListener("message", handleMessage);
    console.log("postMessage受信準備完了");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return [filename, pdfData];
};

function LoadedPDFDataViewer({
  filename,
  pdfData,
}: {
  filename: string;
  pdfData: Uint8Array;
}) {
  const pdf = usePDFPages(pdfData);
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 600,
  });
  const [scale, setScale] = useState(1.0);
  const listRef = useListRef(null);

  const downloadPDF = useCallback(() => {
    const blob = new Blob([new Uint8Array(pdfData)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, [filename, pdfData]);
  return (
    <div>
      <div>
        <button type="button" onClick={() => setScale((prev) => prev - 0.2)}>
          Zoom Out
        </button>
        <button type="button" onClick={() => setScale((prev) => prev + 0.2)}>
          Zoom in
        </button>
        <button type="button" onClick={downloadPDF}>
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
  const [filename, pdfData] = useReceivePDFData();
  if (pdfData) {
    return <LoadedPDFDataViewer filename={filename} pdfData={pdfData} />;
  }
  return <div>Loading....</div>;
}
