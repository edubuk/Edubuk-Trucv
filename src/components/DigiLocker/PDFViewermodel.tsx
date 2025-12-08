import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  open: boolean;
  onClose: () => void;
  rawPdfString: ArrayBuffer;
};

export default function PdfViewerModal({ open, onClose, rawPdfString }: Props) {
  function base64ToBlob() {
    const binary = atob(rawPdfString as any);
    const len = binary.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
    return new Blob([u8.buffer], { type: "application/pdf" });
  }

  const blob = base64ToBlob();
  const objectUrl = URL.createObjectURL(blob);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-5xl h-[85vh] shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-medium">Document</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>

        <div className="h-[calc(85vh-56px)]">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={objectUrl} />;
          </Worker>
        </div>
      </div>
    </div>
  );
}
