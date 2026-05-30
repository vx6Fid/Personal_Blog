import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }) {
  const { slug } = await params;

  // Fetch blog data
  let title = "vx6Fid Blog";
  let tags = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`,
    );
    if (res.ok) {
      const blog = await res.json();
      title = blog.title || title;
      tags = blog.tags || [];
    }
  } catch {
    // Use defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#151515",
          fontFamily: "monospace",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#e5a54b", fontSize: "24px", fontWeight: "bold" }}>
            vx6Fid
          </span>
          <span style={{ color: "#7a7570", fontSize: "16px" }}>
            vx6fid.vercel.app
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              color: "#e8e4df",
              fontSize: title.length > 60 ? "36px" : "48px",
              fontWeight: "bold",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: "12px" }}>
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    color: "#e5a54b",
                    fontSize: "14px",
                    border: "1px solid rgba(229,165,75,0.3)",
                    padding: "4px 10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#e5a54b",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
