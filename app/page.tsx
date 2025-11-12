"use client";

import { PDFViewerFrame } from "./_components/PDFViewerFrame";

export default function Home() {
  return (
    <div>
      <h1>PDF.js Viewer サンプル</h1>
      <a href="/pdf-viewer" target="_blank" rel="noreferrer">
        PDF Viewer を新しいタブで開く
      </a>
      <div style={{ width: "100vw", height: "80vh" }}>
        <PDFViewerFrame filename="sample.pdf" url="/sample.pdf" />
      </div>
    </div>
  );
}
