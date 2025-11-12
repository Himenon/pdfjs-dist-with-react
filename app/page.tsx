"use client";

import { PDFViewerFrame } from "./_components/PDFViewerFrame";

export default function Home() {
  return (
    <div>
      <h1>PDF.js Viewer サンプル</h1>
      <div style={{ width: "100vw", height: "80vh" }}>
        <PDFViewerFrame url={"/sample.pdf"} />
      </div>
    </div>
  );
}
