import { useCallback, useEffect, useRef, useState } from "react";
import {
  createPDFDocument,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "./pdfjs";

export const usePDFPages = (url: string) => {
  const [numPages, setNumPages] = useState<number>(0);
  const pdfProxy = useRef<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<PDFPageProxy[]>([]);

  const getPage = useCallback((page: number): Promise<PDFPageProxy> => {
    if (!pdfProxy.current) {
      throw new Error("PDF document is not loaded yet");
    }
    return pdfProxy.current.getPage(page);
  }, []);

  /** 表示してもいないページを読むのはパフォーマンスが悪いので、表示されたページだけ取得してく */
  const fetchPageWithCache = useCallback(
    async (page: number): Promise<void> => {
      if (pages[page]) {
        return;
      }
      getPage(page).then((pdfPage) => {
        setPages((prev) => {
          const next = prev.slice();
          next[page] = pdfPage;
          return next;
        });
      });
    },
    [getPage, pages],
  );

  useEffect(() => {
    createPDFDocument(url)
      .then(([pdfDocument, pdfInfo]) => {
        setNumPages(pdfInfo.numPages);
        pdfProxy.current = pdfDocument;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return {
    numPages,
    loading,
    fetchPageWithCache,
    pages,
  };
};
