"use client";

import { List as VariableSizeList } from "react-window";
import useResizeObserver from "use-resize-observer";
import { Page } from "./_components/Page";
import PDFViewer from "./_components/PdfViewer";
import { usePDFPages } from "./_utils/usePDFPages";

export default function Home() {
  const { ref, height: internalHeight = 600 } = useResizeObserver();
  const pdf = usePDFPages("/sample.pdf");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <main className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-black dark:text-white">
          PDF.js Viewer サンプル
        </h1>
        <div
          ref={ref}
          style={{
            width: "100%",
            height: "400px",
          }}
        >
          {!pdf.loading && (
            <VariableSizeList
              rowCount={pdf.numPages}
              rowHeight={internalHeight}
              rowProps={{}}
              style={{
                marginBottom: "40px",
              }}
              rowComponent={(props) => {
                const page = props.index + 1;
                pdf.fetchPageWithCache(page);
                return (
                  <Page style={props.style}>
                    <PDFViewer pdfPage={pdf.pages[page]} />
                  </Page>
                );
              }}
            />
          )}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            ※ public/sample.pdf を配置するか、任意のPDFのURLを指定してください
          </p>
        </div>
      </main>
    </div>
  );
}
