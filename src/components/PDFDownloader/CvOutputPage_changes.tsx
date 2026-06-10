// /**
//  * CvOutputPage.tsx  — CHANGES ONLY
//  * ────────────────────────────────────────────────────────────────────────────
//  * Replace the old react-to-print setup with @react-pdf/renderer.
//  * Copy-paste the marked blocks into your existing CvOutputPage.tsx.
//  * ────────────────────────────────────────────────────────────────────────────
//  */

// // ── 1. REMOVE these old imports ───────────────────────────────────────────────
// // import { useReactToPrint } from "react-to-print";
// // const pdfRef = useRef<HTMLDivElement>(null);

// // ── 2. ADD these imports at the top ───────────────────────────────────────────
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import QRCode from "qrcode";
// import { CvPdfDocument } from "./CvPdfDocument"; // adjust path if needed
// import { useEffect, useState } from "react";

// // ── 3. ADD this state + effect inside the component ───────────────────────────
// const [qrDataUrl, setQrDataUrl] = useState<string>("");

// useEffect(() => {
//   if (!id) return;
//   QRCode.toDataURL(`https://edubuktrucv.com/cv/${id}`, {
//     width: 80,
//     margin: 1,
//     color: { dark: "#03257e", light: "#ffffff" },
//   }).then(setQrDataUrl);
// }, [id]);

// // ── 4. REPLACE the Download button JSX with this ──────────────────────────────
// <PDFDownloadLink
//   document={
//     <CvPdfDocument
//       cvData={cvData}
//       qrDataUrl={qrDataUrl}
//       userId={id!}
//     />
//   }
//   fileName={`TruCV-${cvData.personal.fullName || id}.pdf`}
// >
//   {({ loading }) => (
//     <button
//       className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006666] text-white hover:bg-[#006666]/85 transition-all duration-200 text-sm font-semibold disabled:opacity-60"
//       disabled={loading || !qrDataUrl}
//     >
//       {loading || !qrDataUrl ? "Preparing PDF..." : "Download as PDF"}
//     </button>
//   )}
// </PDFDownloadLink>

// // ── 5. ALSO REMOVE — no longer needed ────────────────────────────────────────
// // <div ref={pdfRef} className="...">    ← remove the ref, keep the div
// // handlePrint function
// // useReactToPrint() call
// // pageStyle string
