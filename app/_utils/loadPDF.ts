export const loadPDF = async (
  canvas: HTMLCanvasElement,
  textLayer: HTMLDivElement,
  pdfPath: string,
) => {
  // 動的インポートでブラウザ環境でのみpdf.jsを読み込む
  const pdfjsLib = await import("pdfjs-dist");
  // PDF.jsのworkerを設定
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjsLib.getDocument(pdfPath);
  const pdfDocument = await loadingTask.promise;
  const pdfPage = await pdfDocument.getPage(1);
  const viewport = pdfPage.getViewport({ scale: 1.0 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const renderTask = pdfPage.render({
    viewport,
    canvas,
  });

  await renderTask.promise;

  const textLayerRenderTask = pdfPage.getTextContent().then((textContent) => {
    const textLayerRenderer = new pdfjsLib.TextLayer({
      textContentSource: textContent,
      viewport: viewport,
      container: textLayer,
    });
    return textLayerRenderer.render();
  });
  await textLayerRenderTask;
};
