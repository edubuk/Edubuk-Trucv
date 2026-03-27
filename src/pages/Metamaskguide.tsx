// MetaMaskGuide.tsx
// Brand palette: #03257e (navy), #006666 (teal), #f14419 (orange-red)
import { Wallet2Icon } from "lucide-react";
import { useState, useEffect } from "react";

const C = {
  navy: "#03257e",
  teal: "#006666",
  orange: "#f14419",
  bg: "#010f33",
  cardBg: "#03257e14",
  cardBorder: "#03257e55",
  textPrimary: "#e8f0ff",
  textMuted: "#7fa0d0",
  textDim: "#4d7aaa",
};

interface Action {
  label: string;
  href: string;
  icon: "download" | "video" | "share" | "swap" | "play";
}

interface Step {
  number: number;
  title: string;
  description: string;
  action?: Action[]; // ✅ accepts both
  note?: string;
  highlight?: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Install MetaMask Extension",
    description:
      "MetaMask is a crypto wallet that lives in your browser. Install it from the official Chrome Web Store to get started securely.",
    action: [
      {
        label: "Add MetaMask to Chrome",
        href: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        icon: "download",
      },
    ],
    note: "Only install from the official Chrome Web Store link above.",
  },
  {
    number: 2,
    title: "Create Your Wallet Account",
    description:
      "Follow the video guide to set up your MetaMask account and generate your wallet address. Keep your Secret Recovery Phrase safe — never share it with anyone.",
    action: [
      {
        label: "Watch Setup Tutorial",
        href: "https://www.youtube.com/results?search_query=how+to+create+metamask+wallet",
        icon: "video",
      },
    ],
    note: "Write down your Secret Recovery Phrase on paper and store it safely.",
  },
  {
    number: 3,
    title: "Buy Polygon or BNB Tokens For Bridging",
    description:
      "Buy Polygon or BNB tokens from a trusted exchange and transfer them to your MetaMask wallet. These tokens will be used to bridge your assets to the Eniac Network.",
    action: [
      {
        label: "Buy Polygon Tokens",
        href: "https://www.bitpay.com/buy-polygon",
        icon: "share",
      },
      {
        label: "Buy BNB Tokens",
        href: "https://www.binance.com/en/how-to-buy/bnb",
        icon: "share",
      },
    ],
  },
  {
    number: 4,
    title: "Get ENI Tokens via Swap",
    description:
      "Visit the xPlan swap portal on the Eniac Network. Use your BNB to swap for ENI tokens, which are required to perform blockchain transactions on the platform.",
    action: [
      {
        label: "Open Swap Portal",
        href: "https://xplan.eniac.network/swap",
        icon: "swap",
      },
    ],
    note: "Make sure you have BNB in your wallet before visiting the swap portal.",
  },
  {
    number: 5,
    title: "How to Get ENI Tokens — Video Guide",
    description: "Watch the step-by-step video tutorial...",
    action: [
      {
        // ✅ now an array
        label: "Watch ENI Token Guide",
        href: "https://www.youtube.com/results?search_query=how+to+get+ENI+token+eniac+network",
        icon: "play",
      },
    ],
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconDownload() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
      />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
      />
    </svg>
  );
}

function IconShare() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function IconSwap() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
      />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 8.5l5 3.5-5 3.5V8.5z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 3h6m0 0v6m0-6L8 12M5 5H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-1"
      />
    </svg>
  );
}

type ActionIconType = "download" | "video" | "share" | "swap" | "play";

function ActionIcon({ icon }: { icon: ActionIconType }) {
  switch (icon) {
    case "download":
      return <IconDownload />;
    case "video":
      return <IconVideo />;
    case "share":
      return <IconShare />;
    case "swap":
      return <IconSwap />;
    case "play":
      return <IconPlay />;
  }
}

// ── Step Card ─────────────────────────────────────────────────────────────────

function StepCard({ step, index }: { step: Step; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div
      className="step-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        animationDelay: `${index * 100}ms`,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = isEven
          ? `${C.teal}99`
          : `${C.orange}66`)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = C.cardBorder)
      }
    >
      {/* Top gradient strip */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] rounded-t-2xl transition-all duration-300 group-hover:h-[3px]"
        style={{
          background: isEven
            ? `linear-gradient(to right, ${C.teal}, ${C.navy})`
            : `linear-gradient(to right, ${C.orange}, ${C.teal})`,
        }}
      />

      <div className="flex items-start gap-4">
        {/* Step number badge */}
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-lg text-white shadow-lg"
          style={{
            background: isEven
              ? `linear-gradient(135deg, ${C.navy}, ${C.teal})`
              : `linear-gradient(135deg, ${C.orange}, ${C.navy})`,
          }}
        >
          {step.number}
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow: isEven
                ? `0 0 16px ${C.teal}66`
                : `0 0 16px ${C.orange}66`,
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-bold leading-tight mb-1.5"
            style={{ color: C.textPrimary }}
          >
            {step.title}
          </h3>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: C.textMuted }}
          >
            {step.description}
          </p>

          {/* Highlight pill */}
          {step.highlight && (
            <div
              className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
              style={{
                background: `${C.teal}18`,
                border: `1px solid ${C.teal}55`,
                color: "#7fc4c4",
              }}
            >
              <svg
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ color: C.teal }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {step.highlight}
            </div>
          )}

          {/* Action button */}
          {step.action &&
            step.action.length > 0 &&
            step.action.map((action, index) => (
              <a
                key={index}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2 action-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  background: isEven
                    ? `linear-gradient(135deg, ${C.teal}, ${C.navy})`
                    : `linear-gradient(135deg, ${C.orange}, #c23510)`,
                }}
              >
                <ActionIcon icon={action.icon} />
                {action.label}
                <IconExternal />
              </a>
            ))}

          {/* Note */}
          {step.note && (
            <div
              className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
              style={{
                background: `${C.orange}10`,
                border: `1px solid ${C.orange}33`,
                color: "#d4956e",
              }}
            >
              <svg
                className="mt-0.5 h-3 w-3 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ color: C.orange }}
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{step.note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Connector line between steps ──────────────────────────────────────────────

function Connector({ index }: { index: number }) {
  return (
    <div className="flex justify-center py-1">
      <div
        className="h-6 w-px"
        style={{
          background: `linear-gradient(to bottom, ${index % 2 === 0 ? C.teal : C.orange}66, transparent)`,
        }}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MetaMaskGuide() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle every 2.8s
  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-12 font-sans"
      style={{ background: C.bg }}
    >
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
          style={{ background: C.navy }}
        />
        <div
          className="absolute top-1/3 -right-20 h-72 w-72 rounded-full blur-3xl opacity-20"
          style={{ background: C.teal }}
        />
        <div
          className="absolute bottom-1/4 -left-16 h-56 w-56 rounded-full blur-3xl opacity-15"
          style={{ background: C.orange }}
        />
      </div>

      <div className="relative mx-auto max-w-xl">
        {/* ── Header ── */}
        <div className="mb-10 text-center">
          {/* Fox icon placeholder */}
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl text-2xl"
            style={{
              background: `linear-gradient(135deg, ${C.orange}, #c23510)`,
              boxShadow: `0 8px 32px ${C.orange}44`,
            }}
          >
            <Wallet2Icon />
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{
                background: `linear-gradient(to right, transparent, ${C.teal})`,
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: C.teal }}
            >
              Getting Started
            </span>
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{
                background: `linear-gradient(to left, transparent, ${C.teal})`,
              }}
            />
          </div>

          <h1
            className="text-3xl font-black tracking-tight leading-tight mb-3"
            style={{ color: C.textPrimary }}
          >
            Wallet Setup Guide
          </h1>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: C.textMuted }}
          >
            Follow these 5 steps to install MetaMask, create your wallet, and
            get the tokens you need to participate in the Edubuk ecosystem.
          </p>

          {/* Auto-cycling step preview */}
          <div className="mt-6">
            {/* Dots row */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {steps.map((s, i) => (
                <button
                  key={s.number}
                  onClick={() => setActiveStep(i)}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: i === activeStep ? 28 : 8,
                    height: 8,
                    background:
                      i === activeStep
                        ? i % 2 === 0
                          ? C.teal
                          : C.orange
                        : `${C.navy}88`,
                    border: `1px solid ${
                      i === activeStep
                        ? i % 2 === 0
                          ? C.teal
                          : C.orange
                        : `${C.navy}99`
                    }`,
                    boxShadow:
                      i === activeStep
                        ? `0 0 8px ${i % 2 === 0 ? C.teal : C.orange}88`
                        : "none",
                  }}
                />
              ))}
            </div>

            {/* Active step description card */}
            <div
              key={activeStep}
              className="step-preview rounded-2xl px-5 py-4 text-left"
              style={{
                background: `linear-gradient(135deg, ${C.navy}33, ${activeStep % 2 === 0 ? C.teal : C.orange}18)`,
                border: `1px solid ${activeStep % 2 === 0 ? C.teal : C.orange}44`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    background:
                      activeStep % 2 === 0
                        ? `linear-gradient(135deg, ${C.teal}, ${C.navy})`
                        : `linear-gradient(135deg, ${C.orange}, #c23510)`,
                  }}
                >
                  {steps[activeStep].number}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: activeStep % 2 === 0 ? "#7fc4c4" : "#f9a07a",
                  }}
                >
                  {steps[activeStep].title}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: C.textMuted }}
              >
                {steps[activeStep].description}
              </p>
              {/* Progress bar */}
              <div
                className="mt-3 h-[2px] rounded-full overflow-hidden"
                style={{ background: `${C.navy}66` }}
              >
                <div
                  className="h-full rounded-full progress-bar"
                  style={{
                    background: activeStep % 2 === 0 ? C.teal : C.orange,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Steps ── */}
        <div>
          {steps.map((step, i) => (
            <div key={step.number}>
              <StepCard step={step} index={i} />
              {i < steps.length - 1 && <Connector index={i} />}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div
          className="mt-8 rounded-2xl p-5 text-center"
          style={{
            background: `linear-gradient(135deg, ${C.navy}33, ${C.teal}18)`,
            border: `1px solid ${C.teal}44`,
          }}
        >
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: C.textPrimary }}
          >
            Need help?
          </p>
          <p className="text-xs" style={{ color: C.textDim }}>
            Contact the Edubuk support team for assistance with wallet setup or
            token transfers.
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .font-sans { font-family: 'DM Sans', sans-serif; }
        h1, h3 { font-family: 'Syne', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-card {
          animation: fadeSlideUp 0.45s cubic-bezier(.22,.68,0,1.2) both;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }
        @keyframes stepPreviewIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .step-preview {
          animation: stepPreviewIn 0.35s cubic-bezier(.22,.68,0,1.2) both;
        }
        @keyframes progressSweep {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .progress-bar {
          animation: progressSweep 2.8s linear both;
        }
        .rounded-full { transition: width 0.4s cubic-bezier(.22,.68,0,1.2), background 0.3s, box-shadow 0.3s; }
      `}</style>
    </div>
  );
}
