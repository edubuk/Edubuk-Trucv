import { useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, X, ZoomIn } from "lucide-react";
import { INK, MARIGOLD_DEEP, MONO_FONT, NAVY, TEAL } from "./theme";

// Reusable single-step block: numbered header, screenshot (click to enlarge), optional highlighted description + link.
export const GuideStep = ({
  index,
  image,
  title,
  description,
  tips,
  link,
}: {
  index: number;
  image: string;
  title?: string;
  description?: string;
  /** Field-by-field guidance, each rendered as its own bulleted line. */
  tips?: string[];
  link?: { label: string; href: string };
}) => {
  const [zoomed, setZoomed] = useState(false);
  const alt = title || `Step ${index}`;

  return (
  <div
    className="overflow-hidden rounded-xl border-2 bg-white"
    style={{ borderColor: "rgba(1,113,100,0.14)" }}
  >
    <div
      className="flex items-center gap-2.5 border-b-2 px-4 py-3"
      style={{ borderColor: "rgba(1,113,100,0.10)" }}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10.5px] font-bold"
        style={{ backgroundColor: NAVY, color: "#FFFFFF", fontFamily: MONO_FONT }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span className="text-[13.5px] font-bold" style={{ color: INK }}>
        {title || `Step ${index}`}
      </span>
    </div>

    <button
      type="button"
      onClick={() => setZoomed(true)}
      aria-label={`Enlarge screenshot for ${alt}`}
      className="group relative flex w-full justify-center bg-slate-50 p-3"
    >
      <img
        src={image}
        alt={alt}
        className="max-h-[560px] w-auto max-w-full rounded-md object-contain"
      />
      <span
        className="absolute inset-3 flex items-center justify-center rounded-md bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/25 group-hover:opacity-100"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-sm" style={{ color: INK }}>
          <ZoomIn size={14} />
          Click to enlarge
        </span>
      </span>
    </button>

    {zoomed && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        onClick={() => setZoomed(false)}
      >
        <button
          type="button"
          onClick={() => setZoomed(false)}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
        >
          <X className="size-5" />
        </button>
        <img
          src={image}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[92vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
        />
      </div>
    )}

    {(description || tips?.length) && (
      <div
        className="flex items-start gap-2.5 border-t-2 px-4 py-3.5"
        style={{
          borderColor: "rgba(254,163,1,0.35)",
          backgroundColor: "#FFF9EC",
        }}
      >
        <Sparkles
          size={15}
          color={MARIGOLD_DEEP}
          strokeWidth={2.2}
          className="mt-0.5 shrink-0"
        />
        <div className="min-w-0 flex-1">
          {description && (
            <p
              className="text-[13.5px] font-semibold leading-relaxed"
              style={{ color: INK }}
            >
              {description}
            </p>
          )}
          {tips && tips.length > 0 && (
            <ul className={description ? "mt-2.5 space-y-1.5" : "space-y-1.5"}>
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    color={TEAL}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0"
                  />
                  <span
                    className="text-[13px] leading-relaxed"
                    style={{ color: INK }}
                  >
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {link && (
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold text-white transition hover:-translate-y-0.5"
              style={{ backgroundColor: NAVY }}
            >
              {link.label}
              <ArrowRight size={13} />
            </a>
          )}
        </div>
      </div>
    )}
  </div>
  );
};
