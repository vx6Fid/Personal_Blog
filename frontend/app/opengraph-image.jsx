import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "vx6Fid — Systems, Code & Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#151515",
          fontFamily: "monospace",
          gap: "24px",
        }}
      >
        <h1
          style={{
            color: "#e5a54b",
            fontSize: "72px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          vx6Fid
        </h1>
        <p
          style={{
            color: "#7a7570",
            fontSize: "24px",
          }}
        >
          Systems, Models & Proofs
        </p>
        {/* Accent line */}
        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "#e5a54b",
            marginTop: "16px",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
