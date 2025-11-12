"use client";

import { useState } from "react";
import {
  useDynamicRowHeight,
  useListRef,
  List as VariableSizeList,
} from "react-window";
import { Page } from "./_components/Page";
import PDFViewer from "./_components/PdfViewer";
import { usePDFPages } from "./_utils/usePDFPages";

export default function Home() {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 600,
  });

  const pdfUrl = "/sample.pdf";
  const pdf = usePDFPages(pdfUrl);
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
