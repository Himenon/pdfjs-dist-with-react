import { useEffect, useRef, useState } from "react";
import {
  createParentWindowAction,
  type ParentWindowAction,
} from "../_shared/iframe-event";
import styles from "./PDFViewerFrame.module.css";

const fetchPDF = async (url: string) => {
  return fetch(url)
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((arrayBuffer) => {
      return new Uint8Array(arrayBuffer);
    });
};

const usePDF = (url: string) => {
  const [data, setData] = useState<Uint8Array | null>(null);
  useEffect(() => {
    fetchPDF(url).then((data) => {
      setData(data);
    });
  }, [url]);
  return data;
};

export interface PDFViewerFrame {
  filename: string;
  url: string;
}

export function PDFViewerFrame({ filename, url }: PDFViewerFrame) {
  const parentWindowAction = useRef<ParentWindowAction | null>(null);
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const [iframeStatus, setIframeStatus] = useState<"not-ready" | "ready">(
    "not-ready",
  );
  const pdf = usePDF(url);

  useEffect(() => {
    if (!iframeRef) {
      return;
    }
    parentWindowAction.current = createParentWindowAction(iframeRef);
    const cleanup = parentWindowAction.current.startListen((payload) => {
      if (payload.type === "PDF_VIEWER_READY") {
        setIframeStatus("ready");
      }
    });
    return cleanup;
  }, [iframeRef]);

  useEffect(() => {
    if (pdf && iframeStatus === "ready") {
      console.log("PDFViewerFrame: Sending PDF data", {
        filename,
        pdfSize: pdf.length,
        pdfBufferSize: pdf.buffer.byteLength,
      });
      parentWindowAction.current?.transferPDF(filename, pdf);
    }
  }, [filename, iframeStatus, pdf]);

  return (
    <iframe
      title="PDF Viewer"
      src="./pdf-viewer"
      ref={setIframeRef}
      className={styles.pdfViewerFrame}
    />
  );
}
