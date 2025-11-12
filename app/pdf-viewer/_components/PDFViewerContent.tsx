"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useDynamicRowHeight,
  useListRef,
  List as VariableSizeList,
} from "react-window";
import { createChildWindowAction } from "@/app/_shared/iframe-event";
import { usePDFPages } from "../_utils/usePDFPages";
import { Page } from "./Page";
import PDFViewer from "./PdfViewer";

const useReceivePDFData = (): [string, Uint8Array<ArrayBuffer> | null] => {
  const [filename, setFilename] = useState<string>("");
  const [pdfData, setPdfData] = useState<Uint8Array<ArrayBuffer> | null>(null);
  const childWindowAction = useRef(createChildWindowAction());

  useEffect(() => {
    const cleanup = childWindowAction.current.startListen((payload) => {
      // Array.from()を使ってdetachedされる前に値をコピー
      const sourceArray = new Uint8Array(payload.chunk);
      const copiedArray = Uint8Array.from(sourceArray);
      setPdfData(copiedArray);
      setFilename(payload.filename);
    });
    childWindowAction.current.notifyReady();
    return cleanup;
  }, []);

  return [filename, pdfData];
};

function LoadedPDFDataViewer({
  filename,
  pdfData,
}: {
  filename: string;
  pdfData: Uint8Array<ArrayBuffer>;
}) {
  const pdf = usePDFPages(pdfData);
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 600,
  });
  const [scale, setScale] = useState(1.0);
  const listRef = useListRef(null);

  const downloadPDF = useCallback(() => {
    // データは受信時にコピー済みなのでそのまま使用
    const blob = new Blob([pdfData], {
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

export default function PDFViewerContent() {
  const [filename, pdfData] = useReceivePDFData();
  const frameType = useMemo((): "in-iframe" | "not-in-iframe" | "server" => {
    if (typeof window !== "undefined") {
      if (window.self !== window.top) {
        return "in-iframe";
      }
      return "not-in-iframe";
    }
    return "server";
  }, []);

  if (pdfData) {
    return <LoadedPDFDataViewer filename={filename} pdfData={pdfData} />;
  }

  if (frameType === "not-in-iframe") {
    return (
      <div>
        <p>
          {frameType}
          このURLをiframeで開いて、postMessageからPDFのデータを送信してください。
        </p>
      </div>
    );
  }
  if (frameType === "in-iframe") {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  }

  return <div>Server Side</div>;
}
