const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  .shimmer {
    background: linear-gradient(
      90deg,
      #e8edf5 0px,
      #f4f7fc 40px,
      #e8edf5 80px
    );
    background-size: 700px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 8px;
  }
`;

function Shimmer({ style = {}, className = "" }) {
  return <div className={`shimmer ${className}`} style={style} />;
}

// Mimics a single certificate card
function CertCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f2f7",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Top row: issuer + status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Shimmer style={{ width: 100, height: 11, borderRadius: 6 }} />
          <Shimmer style={{ width: 150, height: 15, borderRadius: 6 }} />
        </div>
        {/* Status badge */}
        <Shimmer style={{ width: 64, height: 22, borderRadius: 999 }} />
      </div>

      {/* Middle row: method chip + date */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Shimmer style={{ width: 80, height: 20, borderRadius: 999 }} />
        <Shimmer style={{ width: 70, height: 11, borderRadius: 6 }} />
      </div>

      {/* Bottom row: resend button + view link */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Shimmer style={{ width: 110, height: 26, borderRadius: 6 }} />
        <Shimmer style={{ width: 90, height: 14, borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function UserDocsSkeleton() {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div style={{ minHeight: "100vh", width: "100%", background: "#f7f8fb" }}>
        <main
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #f0f2f7",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* Profile row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                borderBottom: "1px solid #f0f2f7",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar */}
                <Shimmer style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <Shimmer style={{ width: 140, height: 16, borderRadius: 7 }} />
                  <Shimmer style={{ width: 210, height: 12, borderRadius: 6 }} />
                </div>
              </div>
            </div>
            <div className="relative mx-6 mt-4">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] opacity-90" />
              <div className="relative bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                    >
                        <p className="h-10 w-10 rounded-full"></p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Shimmer style={{ width: 120, height: 10, borderRadius: 7 }} />
                      <Shimmer style={{ width: 120, height: 10, borderRadius: 7 }} />
                    </div>
                  </div>
                  <Shimmer style={{ width:150, height:20, borderRadius: 3 }} />
                  </div>
                </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
          <Shimmer style={{ width: 20, height: 20, borderRadius: 5 }} />
          <Shimmer style={{ width: 180, height: 16, borderRadius: 7, marginTop: 8 }} />
          <Shimmer style={{ width: "70%", height: 12, borderRadius: 6, marginTop: 6 }} />
        </div>
      ))}
    </div>

            {/* Section body */}
            <div style={{ padding: "20px 24px 24px" }}>
              {/* Section heading */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Shimmer style={{ width: 20, height: 20, borderRadius: 5 }} />
                <Shimmer style={{ width: 180, height: 16, borderRadius: 7 }} />
              </div>

              {/* Note line */}
              <Shimmer style={{ width: "70%", height: 12, borderRadius: 6, marginBottom: 16 }} />

              {/* Certificate cards grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <CertCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}