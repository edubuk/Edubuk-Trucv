import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface SessionExpiredPopupProps {
  expiresAt: number | undefined
}

const THREE_MINUTES = 3 * 60 * 1000;

const SessionExpiredPopup = ({
  expiresAt,
}: SessionExpiredPopupProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  const expiryTime = useMemo(() => {
    if (!expiresAt) return null;
    
    if (typeof expiresAt === "number") {
      return expiresAt.toString().length === 10 ? expiresAt * 1000 : expiresAt;
    }

    return new Date(expiresAt).getTime();
  }, [expiresAt]);

  useEffect(() => {
    if (!expiryTime || Number.isNaN(expiryTime) || hasShownPopup) return;

    const checkSessionExpiry = () => {
      const timeLeft = expiryTime - Date.now();

      if (timeLeft <= THREE_MINUTES) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    };

    checkSessionExpiry();

    const intervalId = window.setInterval(checkSessionExpiry, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [expiryTime, hasShownPopup]);

//   const handleLoginClick = () => {
//     setShowPopup(false);
//     window.location.href = loginPath;
//   };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#03257e]/60 px-4">
      <div className="w-full max-w-[420px] rounded-lg border-t-[6px] border-[#f14419] bg-white px-6 py-7 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#f14419] text-3xl font-bold text-white">
          !
        </div>

        <h2 className="mb-2 text-2xl font-bold text-[#03257e]">
          Session Expired
        </h2>

        <p className="mb-6 text-[15px] leading-relaxed text-[#006666]">
          Your session is about to expire. Please login again to continue.
        </p>

        <Link
          to="/login"
          onClick={() => setShowPopup(false)}
          className="w-full rounded-md bg-[#006666] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#03257e]"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SessionExpiredPopup;