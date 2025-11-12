interface ChildWindowReadyMessage {
  type: "PDF_VIEWER_READY";
}

export type ChildWindowMessage = ChildWindowReadyMessage;

interface ParentWindowTransferPDFMessage {
  filename: string;
  chunk: ArrayBuffer;
}

export type ParentWindowMessage = ParentWindowTransferPDFMessage;

export interface ReceiveMessage {
  filename: string;
  chunk: Uint8Array<ArrayBuffer>;
}

export const createChildWindowAction = () => {
  const notifyReady = () => {
    if (window.parent === window) {
      return;
    }
    const message: ChildWindowMessage = {
      type: "PDF_VIEWER_READY",
    };
    window.parent.postMessage(message, window.location.origin);
    console.info("Child Window: notify ready");
  };

  const createHandleMessage =
    (onMessage: (message: ParentWindowMessage) => void) =>
    (event: MessageEvent) => {
      /**
       * 同一オリジンのみ可能
       */
      if (event.origin !== window.location.origin) {
        console.warn(
          `Blocked postMessage from different origin: ${event.origin}`,
        );
        return;
      }
      const data = event.data as ParentWindowTransferPDFMessage;
      onMessage({
        filename: data.filename,
        chunk: data.chunk,
      });
    };

  const startListen = (onMessage: (message: ParentWindowMessage) => void) => {
    const handleMessage = createHandleMessage(onMessage);
    window.addEventListener("message", handleMessage);
    console.info("Child Window: start listening messages");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  };

  return {
    notifyReady,
    startListen,
  };
};

export const createParentWindowAction = (iframe: HTMLIFrameElement) => {
  const transferPDF = (filename: string, data: Uint8Array<ArrayBuffer>) => {
    const message: ParentWindowTransferPDFMessage = {
      filename: filename,
      chunk: data.buffer,
    };
    iframe.contentWindow?.postMessage(message, window.location.origin);
  };

  const createHandleMessage =
    (onMessage: (message: ChildWindowMessage) => void) =>
    (event: MessageEvent) => {
      // 同一オリジンのみ可能
      if (event.origin !== window.location.origin) {
        return;
      }
      const eventData = event.data as ChildWindowReadyMessage;
      // iframeから準備完了の通知を受け取る
      if (eventData.type === "PDF_VIEWER_READY") {
        onMessage({
          type: "PDF_VIEWER_READY",
        });
      }
    };

  const startListen = (onMessage: (message: ChildWindowMessage) => void) => {
    const handleMessage = createHandleMessage(onMessage);
    window.addEventListener("message", handleMessage);
    console.info("Parent Window: start listening messages");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  };

  return {
    transferPDF,
    startListen,
  };
};

export type ParentWindowAction = ReturnType<typeof createParentWindowAction>;
