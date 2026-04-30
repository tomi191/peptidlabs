import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #0d9488 100%)",
          color: "white",
          fontSize: 320,
          fontWeight: 700,
          letterSpacing: -12,
          borderRadius: 96,
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
