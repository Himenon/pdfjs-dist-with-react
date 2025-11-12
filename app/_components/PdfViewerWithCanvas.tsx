"use client";

import { useEffect, useRef, useState } from "react";

const loadPDF = async (canvas: HTMLCanvasElement, pdfPath: string) => {
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
};

interface PdfViewerWithCanvasProps {
	pdfUrl: string;
}

export default function PdfViewerWithCanvas({
	pdfUrl,
}: PdfViewerWithCanvasProps) {
	const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// PDFをロード
	useEffect(() => {
		if (!canvasRef) {
			return;
		}
		loadPDF(canvasRef, pdfUrl)
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error loading PDF:", err);
				setLoading(false);
			});
	}, [pdfUrl, canvasRef]);

	return (
		<div>
			{loading && <p>PDFを読み込んでいます...</p>}
			<canvas ref={setCanvasRef} width={"256px"} height="256px" />
		</div>
	);
}
