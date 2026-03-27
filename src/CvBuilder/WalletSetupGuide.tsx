import { CircleX, WalletIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function WalletSetupPopup({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(3,37,126,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "0.5px solid #006666",
          padding: "32px 28px 28px",
          maxWidth: 420,
          width: "100%",
        }}
      >
        {/* icon */}
        <div className="flex justify-between items-center">
          <div>
            <WalletIcon />
          </div>
          <div>
            <CircleX onClick={onClose} />
          </div>
        </div>

        <p
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: "#03257e",
            marginBottom: 12,
          }}
        >
          Wallet setup required
        </p>

        <p
          style={{
            fontSize: 14,
            color: "#006666",
            lineHeight: 1.7,
            marginBottom: 10,
          }}
        >
          Please set up your wallet and add the{" "}
          <strong style={{ color: "#03257e" }}>ENI Token</strong> before
          creating your CV. This is needed to register your document on-chain.
        </p>

        {/* steps */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {["1. Install wallet", "2. Add ENI token", "3. Create CV"].map(
            (s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: "#006666",
                  background: "#e6f5f5",
                  border: "0.5px solid #006666",
                  borderRadius: 20,
                  padding: "4px 8px",
                  textAlign: "center",
                }}
              >
                {s}
              </div>
            ),
          )}
        </div>

        {/* notice */}
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "#fff7f5",
            borderLeft: "3px solid #f14419",
            borderRadius: "0 8px 8px 0",
            padding: "10px 14px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#f14419",
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: 13,
              color: "#f14419",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            ENI token is required to pay gas fees for on-chain document
            registration.
          </p>
        </div>

        {/* button */}
        <Link
          to="/setup-wallet"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "11px 20px",
            background: "#03257e",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          View setup guide ↗
        </Link>
      </div>
    </div>
  );
}
