// app/sitemap.xml/route.js
import { NextResponse } from "next/server";

const fetchBlogs = async () => {
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!url) throw new Error("API base URL is not defined");

    const response = await fetch(`${url}/blogs`);
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return (data.blogs || []);
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
  }
};

export async function GET() {
  const baseUrl = "https://vx6fid.vercel.app";

  const staticPages = [
    { url: "/", priority: 1.0 },
    { url: "/blogs", priority: 0.8 },
    { url: "/projects", priority: 0.8 },
    { url: "/about", priority: 0.8 },
    { url: "/contact", priority: 0.8 },
  ];

  const blogPosts = await fetchBlogs(); // ← Pull your real post slugs here

  const blogUrls = blogPosts.map((post) => ({
    url: `/blogs/${post.slug}`,
    priority: 0.7,
    lastmod: post.updatedAt,
  }));

  const pages = [...staticPages, ...blogUrls];

  const urls = pages
    .map(({ url, priority, lastmod }) => {
      return `
        <url>
          <loc>${baseUrl}${url}</loc>
          <lastmod>${lastmod || new Date().toISOString()}</lastmod>
          <priority>${priority.toFixed(2)}</priority>
        </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
