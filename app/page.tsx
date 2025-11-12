"use client";

import { PDFViewerFrame } from "./_components/PDFViewerFrame";

export default function Home() {
  return (
    <div>
      <h1>PDF.js Viewer の実装サンプル</h1>
      <a href="./pdf-viewer" target="_blank" rel="noreferrer">
        PDF Viewer を新しいタブで開く
      </a>
      <p>
        Repository:{" "}
        <a
          href="https://github.com/Himenon/pdfjs-dist-with-react"
          target="_blank"
          rel="noreferrer"
        >
          Himenon/pdfjs-dist-with-react
        </a>
      </p>
      <div style={{ width: "100vw", height: "80vh" }}>
        <PDFViewerFrame filename="sample.pdf" url="./sample.pdf" />
      </div>
    </div>
  );
}
