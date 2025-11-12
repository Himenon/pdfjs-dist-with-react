import { useEffect, useState } from "react";
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
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const pdf = usePDF(url);

  useEffect(() => {
    if (!iframeRef || !pdf) {
      return;
    }
    console.log("postMessage送信");
    iframeRef.contentWindow?.postMessage({
      filename: filename,
      chunk: new Uint8Array(pdf),
    });
  }, [iframeRef, pdf, filename]);

  return (
    <iframe
      title="PDF Viewer"
      src="/pdf-viewer"
      ref={setIframeRef}
      className={styles.pdfViewerFrame}
    />
  );
}
