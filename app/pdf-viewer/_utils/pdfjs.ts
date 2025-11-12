import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export type { PDFDocumentProxy, PDFPageProxy };

interface PDFInfo {
  numPages: number;
}

export const createPDFDocument = async (
  source: string | Uint8Array,
): Promise<[PDFDocumentProxy, PDFInfo]> => {
  // 動的インポートでブラウザ環境でのみpdf.jsを読み込む
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs`;
  }
  const loadingTask = pdfjsLib.getDocument(source);
  const pdfDocument = await loadingTask.promise;

  const pdfInfo = pdfDocument._pdfInfo as PDFInfo;

  return [pdfDocument, pdfInfo];
};

type RenderOptions = {
  scale?: number;
};

export const renderPDFPage = async (
  pdfPage: PDFPageProxy,
  canvas: HTMLCanvasElement,
  textLayer: HTMLDivElement,
  options: RenderOptions = {
    scale: 1.0,
  },
): Promise<void> => {
  const { TextLayer } = await import("pdfjs-dist");
  const viewport = pdfPage.getViewport({ scale: options.scale ?? 1.0 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const renderTask = pdfPage.render({
    viewport,
    canvas,
  });

  await renderTask.promise;

  const textLayerRenderTask = pdfPage.getTextContent().then((textContent) => {
    const textLayerRenderer = new TextLayer({
      textContentSource: textContent,
      viewport: viewport,
      container: textLayer,
    });
    return textLayerRenderer.render();
  });
  await textLayerRenderTask;
  console.log({ pdfPage, canvas, textLayer });
};
