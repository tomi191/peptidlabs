import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — 180x180 PNG.
 * Apple does NOT honor SVG favicons, so we render the brand mark via Satori.
 * Uses inline SVG inside ImageResponse (Satori supports a subset of SVG).
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
          background: "#0f172a",
          borderRadius: 38,
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 22 16 V 48 M 22 16 H 35 a 9 9 0 0 1 0 18 H 22"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line
            x1="36"
            y1="42"
            x2="44"
            y2="46"
            stroke="#14b8a6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <circle cx="46" cy="46" r="4" fill="#14b8a6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
