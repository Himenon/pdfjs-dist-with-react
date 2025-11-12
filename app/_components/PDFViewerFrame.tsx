import { useEffect, useState } from "react";

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
  url: string;
}

export function PDFViewerFrame(props: PDFViewerFrame) {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement>(null);
  const pdf = usePDF(props.url);

  useEffect(() => {
    if (!iframeRef) {
      return;
    }
    iframeRef.contentWindow?.postMessage(pdf);
  }, [iframeRef, pdf]);

  return <iframe title="PDF Viewer" src="/pdf-viewer" ref={setIframeRef} />;
}
