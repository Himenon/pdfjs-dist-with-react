"use client";

import { useEffect, useState } from "react";
import { type PDFPageProxy, renderPDFPage } from "../_utils/pdfjs";
import styles from "./PDFViewer.module.css";

interface PDFViewerProps {
  pdfPage: PDFPageProxy | undefined;
  scale: number;
}

function PDFViewer({ pdfPage, scale }: PDFViewerProps) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [textLayerRef, setTextLayer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pdfPage || !canvasRef || !textLayerRef) {
      return;
    }
    renderPDFPage(pdfPage, canvasRef, textLayerRef, { scale: scale }).catch(
      (err) => {
        console.error("Error loading PDF:", err);
      },
    );
  }, [pdfPage, canvasRef, textLayerRef, scale]);

  return (
    <div className={styles.pdfContainer}>
      <canvas ref={setCanvasRef} className={styles.pdfViewer} />
      <div ref={setTextLayer} className={styles.textLayer} />
    </div>
  );
}

export default PDFViewer; //React.memo(PDFViewer);
