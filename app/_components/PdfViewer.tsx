"use client";

import { useEffect, useState } from "react";
import { type PDFPageProxy, renderPDFPage } from "../_utils/pdfjs";
import styles from "./PDFViewer.module.css";

interface PDFViewerProps {
  pdfPage: PDFPageProxy | undefined;
}

function PDFViewer({ pdfPage }: PDFViewerProps) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [textLayerRef, setTextLayer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pdfPage || !canvasRef || !textLayerRef) {
      return;
    }
    renderPDFPage(pdfPage, canvasRef, textLayerRef).catch((err) => {
      console.error("Error loading PDF:", err);
    });
  }, [pdfPage, canvasRef, textLayerRef]);
  return (
    <div className={styles.pdfContainer}>
      <canvas ref={setCanvasRef} className={styles.pdfViewer} />
      <div ref={setTextLayer} className={styles.textLayer} />
    </div>
  );
}

export default PDFViewer; //React.memo(PDFViewer);
