"use client";

import React, { useEffect, useState } from "react";
import { loadPDF } from "../_utils/loadPDF";
import styles from "./PDFViewer.module.css";

interface PDFViewerProps {
  pdfUrl: string;
}

function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [textLayerRef, setTextLayer] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!canvasRef || !textLayerRef) {
      return;
    }
    loadPDF(canvasRef, textLayerRef, pdfUrl)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading PDF:", err);
        setLoading(false);
      });
  }, [pdfUrl, canvasRef, textLayerRef]);

  return (
    <div className={styles.pdfContainer}>
      {loading && <p>PDFを読み込んでいます...</p>}
      <canvas ref={setCanvasRef} className={styles.pdfViewer} />
      <div ref={setTextLayer} className={styles.textLayer} />
    </div>
  );
}

export default React.memo(PDFViewer);
