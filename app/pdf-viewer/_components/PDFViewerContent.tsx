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

const useReceivePDFData = (): [
  string,
  Uint8Array<ArrayBuffer> | null,
  Uint8Array<ArrayBuffer> | null,
] => {
  const [filename, setFilename] = useState<string>("");
  const [pdfData, setPdfData] = useState<Uint8Array<ArrayBuffer> | null>(null);
  const [downloadData, setDownloadData] =
    useState<Uint8Array<ArrayBuffer> | null>(null);
  const childWindowAction = useRef(createChildWindowAction());

  useEffect(() => {
    const cleanup = childWindowAction.current.startListen((payload) => {
      console.log("PDFViewerContent: Received data", {
        filename: payload.filename,
        bufferSize: payload.buffer.byteLength,
      });
      // detachedされる前にArrayBufferをsliceでコピー
      const buffer = payload.buffer.slice(0);
      const copiedArray = new Uint8Array(buffer);
      console.log("PDFViewerContent: Copied data", {
        copiedSize: copiedArray.length,
        copiedBufferSize: copiedArray.buffer.byteLength,
      });
      // さらに新しいバッファを作成して確実にコピー
      const permanentBuffer = new ArrayBuffer(copiedArray.length);
      const permanentArray = new Uint8Array(permanentBuffer);
      permanentArray.set(copiedArray);
      console.log("PDFViewerContent: Permanent copy created", {
        permanentSize: permanentArray.length,
        permanentBufferSize: permanentArray.buffer.byteLength,
      });

      // ダウンロード用に別のコピーを作成
      const downloadBuffer = new ArrayBuffer(copiedArray.length);
      const downloadArray = new Uint8Array(downloadBuffer);
      downloadArray.set(copiedArray);

      setPdfData(permanentArray);
      setDownloadData(downloadArray);
      setFilename(payload.filename);
    });
    childWindowAction.current.notifyReady();
    return cleanup;
  }, []);

  return [filename, pdfData, downloadData];
};

function LoadedPDFDataViewer({
  filename,
  pdfData,
  downloadData,
}: {
  filename: string;
  pdfData: Uint8Array<ArrayBuffer>;
  downloadData: Uint8Array<ArrayBuffer>;
}) {
  console.log("LoadedPDFDataViewer: Received pdfData", {
    pdfDataSize: pdfData.length,
    pdfDataBufferSize: pdfData.buffer.byteLength,
  });
  const pdf = usePDFPages(pdfData);
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 600,
  });
  const [scale, setScale] = useState(1.0);
  const listRef = useListRef(null);

  const downloadPDF = useCallback(() => {
    console.log("downloadPDF: Creating blob", {
      downloadDataSize: downloadData.length,
      downloadDataBufferSize: downloadData.buffer.byteLength,
    });
    // ダウンロード専用のコピーを使用
    const blob = new Blob([downloadData], {
      type: "application/pdf",
    });
    console.log("downloadPDF: Blob created", { blobSize: blob.size });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, [filename, downloadData]);
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
  const [filename, pdfData, downloadData] = useReceivePDFData();
  const frameType = useMemo((): "in-iframe" | "not-in-iframe" | "server" => {
    if (typeof window !== "undefined") {
      if (window.self !== window.top) {
        return "in-iframe";
      }
      return "not-in-iframe";
    }
    return "server";
  }, []);

  if (frameType === "not-in-iframe") {
    return (
      <div>
        <p>
          このURLをiframeで開いて、postMessageからPDFのデータを送信してください。
        </p>
      </div>
    );
  }
  if (frameType === "in-iframe") {
    if (pdfData && downloadData) {
      return (
        <LoadedPDFDataViewer
          filename={filename}
          pdfData={pdfData}
          downloadData={downloadData}
        />
      );
    }
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  }

  return <div>Server Side</div>;
}
