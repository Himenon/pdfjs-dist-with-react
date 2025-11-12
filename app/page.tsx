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

export default function Home() {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 600,
  });
  const pdf = usePDFPages("/sample.pdf");
  const [scale, setScale] = useState(1.0);
  const listRef = useListRef(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <main className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-black dark:text-white">
          PDF.js Viewer サンプル
        </h1>
        <div>
          <button type="button" onClick={() => setScale((prev) => prev + 0.1)}>
            Scale +0.1
          </button>
          <button type="button" onClick={() => setScale((prev) => prev - 0.1)}>
            Scale -0.1
          </button>
        </div>
        <div
          style={{
            width: "100%",
            height: "80vh",
            background: "#CCC",
            padding: "8px 0",
          }}
        >
          {!pdf.loading && (
            <VariableSizeList
              listRef={listRef}
              rowCount={pdf.numPages}
              rowHeight={rowHeight}
              rowProps={{}}
              style={{}}
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
        {pdf.loading && (
          <div>
            <p>
              ※ public/sample.pdf を配置するか、任意のPDFのURLを指定してください
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
