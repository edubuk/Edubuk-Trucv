import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IImportedProfiles } from "@/api/scraper.api";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const proxyImage = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
const ProfileCard = ({
  profile,
  index,
}: {
  profile: IImportedProfiles;
  index: number;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "10px",
        background: "rgba(3,102,101,0.03)",
        border: "1px solid rgba(3,102,101,0.1)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        animation: `fadeSlideIn 0.3s ease both`,
        animationDelay: `${index * 50}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(3,102,101,0.07)";
        e.currentTarget.style.borderColor = "rgba(3,102,101,0.25)";
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(3,102,101,0.03)";
        e.currentTarget.style.borderColor = "rgba(3,102,101,0.1)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {!imgError ? (
          <img
            src={proxyImage(profile.imgUrl)}
            alt={profile.fullName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
              setImgError(true);
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(3,102,101,0.3)",
            }}
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #024544, #048a89)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "700",
              color: "white",
              border: "2px solid rgba(3,102,101,0.3)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {getInitials(profile.fullName)}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "1px",
            right: "1px",
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: "#10b981",
            border: "2px solid #ffffff",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: "2px" }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600",
              fontSize: "13px",
              color: "#0f172a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {profile.fullName}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: "#64748b",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {profile.linkdeinScrapedUrl.replace(
            "https://www.linkedin.com/in/",
            "linkedin.com/in/",
          )}
        </div>
      </div>

      {/* Right side */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <a
          href={profile.linkdeinScrapedUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "#0ea5e9",
            marginBottom: "3px",
            textDecoration: "none",
            justifyContent: "flex-end",
          }}
        >
          <LinkedInIcon />
          <span
            style={{
              fontSize: "11px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "500",
            }}
          >
            View
          </span>
        </a>
        <div
          style={{
            fontSize: "11px",
            fontFamily: "'DM Sans', sans-serif",
            color: "#94a3b8",
          }}
        >
          {timeAgo(profile.scrapedAt.toString())}
        </div>
      </div>
    </div>
  );
};

const AllImportedLinkedInProfilesModal = ({
  importedProfiles,
}: {
  importedProfiles: IImportedProfiles[];
}) => {
  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="inline-flex items-center gap-1.5 px-4 py-2 border-none rounded-lg text-[13px] font-medium text-white cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background:
                "linear-gradient(135deg, #024544 0%, #036665 55%, #048a89 100%)",
              boxShadow: "0 2px 10px rgba(3,102,101,0.35)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            View imported profiles
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "0 6px",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {importedProfiles.length}
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent
          style={{
            background: "#ffffff",
            border: "1px solid rgba(3,102,101,0.12)",
            borderRadius: "18px",
            padding: 0,
            maxWidth: "480px",
            width: "100%",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(3,102,101,0.08)",
            overflow: "hidden",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header */}
          <DialogHeader
            style={{
              padding: "20px 20px 16px",
              borderBottom: "1px solid rgba(3,102,101,0.08)",
              background:
                "linear-gradient(180deg, rgba(3,102,101,0.05) 0%, transparent 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #024544, #048a89)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <DialogTitle
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#0f172a",
                    fontFamily: "'DM Sans', sans-serif",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Imported Profiles
                </DialogTitle>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {importedProfiles.length} profile
                  {importedProfiles.length !== 1 ? "s" : ""} imported
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Profile List */}
          <div
            style={{
              padding: "10px",
              maxHeight: "360px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {importedProfiles.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                No profiles found
              </div>
            ) : (
              importedProfiles.map((profile, i) => (
                <ProfileCard key={profile._id} profile={profile} index={i} />
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(3,102,101,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(3,102,101,0.02)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {importedProfiles.length} total profile
              {importedProfiles.length !== 1 ? "s" : ""} imported
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10b981",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Synced
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllImportedLinkedInProfilesModal;
