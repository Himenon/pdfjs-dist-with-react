"use client";

import PdfViewer from "./_components/PdfViewer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <main className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-black dark:text-white">
          PDF.js Viewer サンプル
        </h1>
        <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
          <PdfViewer pdfUrl="/sample.pdf" />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            ※ public/sample.pdf を配置するか、任意のPDFのURLを指定してください
          </p>
        </div>
      </main>
    </div>
  );
}
