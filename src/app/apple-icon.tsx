import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — 180x180 PNG. Apple does not honor SVG favicons.
 * Renders the same molecular hexagon mark via Satori (inline SVG).
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="32,10 50,21 50,43 32,54 14,43 14,21"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="10" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <circle cx="50" cy="21" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <circle cx="50" cy="43" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <circle cx="14" cy="43" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <circle cx="32" cy="32" r="5.5" fill="#14b8a6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
