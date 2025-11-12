"use client";

import { PDFViewerFrame } from "./_components/PDFViewerFrame";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <main className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-black dark:text-white">
          PDF.js Viewer サンプル
        </h1>
        <PDFViewerFrame url={"/sample.pdf"} />
      </main>
    </div>
  );
}
