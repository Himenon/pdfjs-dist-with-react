"use client";

import dynamic from "next/dynamic";

const PDFViewerContent = dynamic(
  () => import("./_components/PDFViewerContent"),
  {
    ssr: false,
  },
);

export default PDFViewerContent;
