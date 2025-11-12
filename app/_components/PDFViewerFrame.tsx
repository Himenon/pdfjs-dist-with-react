import { useEffect, useState } from "react";
import styles from "./PDFViewerFrame.module.css";
import { IframeEvent } from "../_shared/iframe-event";

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
  const [iframeStatus, setIframeStatus] = useState<"not-ready" | "ready">(
    "not-ready",
  );
  const pdf = usePDF(url);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 同一オリジンのみ可能
      if (event.origin !== window.location.origin) {
        return;
      }
      // iframeから準備完了の通知を受け取る
      if (event.data?.type === IframeEvent.PDF_VIEWER_READY) {
        setIframeStatus("ready");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!iframeRef || !pdf || iframeStatus !== "ready") {
      return;
    }
    console.log("postMessage送信");
    iframeRef.contentWindow?.postMessage(
      {
        filename: filename,
        chunk: new Uint8Array(pdf),
      },
      window.location.origin,
    );
  }, [iframeRef, pdf, filename, iframeStatus]);

  return (
    <iframe
      title="PDF Viewer"
      src="/pdf-viewer"
      ref={setIframeRef}
      className={styles.pdfViewerFrame}
    />
  );
}
