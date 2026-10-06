import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export function EdubukQR({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 62,
        margin: 1,
        color: {
          dark: "#03257e",
          light: "#ffffff",
        },
      });
    }
  }, []);

  return <canvas ref={canvasRef} className="shrink-0 rounded" />;
}
