// PdfViewerModal.tsx
// React + TypeScript single-file modal component using Tailwind CSS
// Accepts PDF data as: data URL, base64 string (no prefix), ArrayBuffer, or remote URL.

import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** string = data URL | base64 (no prefix) | remote URL. Or an ArrayBuffer for binary data. */
  pdfSource: string | ArrayBuffer | null;
  title?: string;
};

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

const PdfViewerModal: React.FC<Props> = ({ open, onClose, pdfSource, title = "PDF Document" }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!pdfSource) {
      setObjectUrl(null);
      return;
    }

    let createdBlob: Blob | null = null;
    let url: string | null = null;

    try {
      if (typeof pdfSource === "string") {
        // case: data URL like 'data:application/pdf;base64,...'
        if (pdfSource.startsWith("data:")) {
          url = pdfSource;
        } else if (pdfSource.startsWith("http://") || pdfSource.startsWith("https://")) {
          // remote URL
          url = pdfSource;
        } else {
          // assume raw base64 (no prefix)
          const bytes = base64ToUint8Array(pdfSource);
          createdBlob = new Blob([bytes], { type: "application/pdf" });
          url = URL.createObjectURL(createdBlob);
        }
      } else if (pdfSource instanceof ArrayBuffer) {
        createdBlob = new Blob([pdfSource], { type: "application/pdf" });
        url = URL.createObjectURL(createdBlob);
      }

      setObjectUrl(url);
    } catch (err) {
      console.error("Failed to create PDF preview:", err);
      setObjectUrl(null);
    }

    return () => {
      // Revoke only if we created a blob URL
      if (createdBlob && url && url.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [open, pdfSource]);

  // Lock background scroll while modal open
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true" role="dialog" aria-label={title}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      {/* Modal */}
      <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">{title}</h3>
            <span className="text-sm text-slate-500">(Preview)</span>
          </div>

          <div className="flex items-center gap-2">
            {objectUrl ? (
              <>
                <a href={objectUrl} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1 rounded-md hover:bg-slate-100">Open</a>
                <a href={objectUrl} download={`${title.replace(/\s+/g, "_")}.pdf`} className="text-sm px-3 py-1 rounded-md hover:bg-slate-100">Download</a>
              </>
            ) : (
              <span className="text-sm text-slate-500 px-3 py-1">No preview</span>
            )}
            <button onClick={onClose} className="ml-2 inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100" aria-label="Close">✕</button>
          </div>
        </div>

        {/* Scrollable body with PDF iframe */}
        <div className="flex-1 overflow-y-scroll bg-slate-50">
          {objectUrl ? (
            <iframe src={objectUrl} title={title} className="w-full min-h-[600px] h-full" style={{ border: "none" }} />
          ) : (
            <div className="p-6 text-center text-sm text-slate-600">Loading preview… If it doesn't appear, use Open/Download above.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
