require("dotenv").config();
const RSS = require("rss");
const Feed = RSS.default || RSS;
const fs = require("fs");
const path = require("path");

async function generateRSS() {
  const siteUrl = "https://vx6fid.vercel.app";
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    throw new Error("API base URL is not defined");
  }

  try {
    const res = await fetch(`${apiUrl}/blogs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const { blogs } = await res.json();

    const feed = new Feed({
      title: "vx6fid's Blog",
      description: "Where systems break, code laughs, and caffeine fuels the chaos.",
      id: siteUrl,
      link: siteUrl,
      language: "en",
      favicon: `${siteUrl}/favicon.ico`,
      updated: new Date(),
      feedLinks: {
        rss2: `${siteUrl}/rss.xml`,
      },
      author: "Achal",
    });

    blogs.forEach((blog) => {
      const plainText =
        blog.content
          .replace(/(<([^>]+)>)/gi, "")
          .slice(0, 300)
          .trim() + "...";

      feed.item({
        title: blog.title,
        id: `${siteUrl}/blog/${blog.slug}`,
        link: `${siteUrl}/blog/${blog.slug}`,
        description: plainText,
        content: blog.content || "",
        date: new Date(blog.created_at),
      });
    });

    // Write to frontend's public folder
    const outputPath = path.join(__dirname, "../public/rss.xml");
    
    // Make sure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, feed.xml({ indent: true }));
    console.log("-- :) -- RSS feed generated at frontend/public/rss.xml");
  } catch (err) {
    console.error("-- :| -- Failed to generate RSS feed:", err.message);
    throw err;
  }
}

module.exports = generateRSS;