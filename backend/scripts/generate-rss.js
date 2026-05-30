require("dotenv").config();
const RSS = require("rss");
const Feed = RSS.default || RSS;
const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function generateRSS() {
  const siteUrl = "https://vx6fid.vercel.app";

  try {
    // Fetch directly from DB to get full content (not the truncated API response)
    const { rows: blogs } = await pool.query(
      "SELECT title, slug, content, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 20",
    );

    const feed = new Feed({
      title: "vx6Fid's Blog",
      description:
        "Systems, code, and engineering insights from vx6Fid.",
      id: siteUrl,
      link: siteUrl,
      language: "en",
      favicon: `${siteUrl}/favicon.ico`,
      updated: blogs.length > 0 ? new Date(blogs[0].created_at) : new Date(),
      feedLinks: {
        rss2: `${siteUrl}/rss.xml`,
      },
      author: "Achal Nath Tiwari",
    });

    blogs.forEach((blog) => {
      const plainText =
        (blog.content || "")
          .replace(/[#*`>\[\]()!_~]/g, "")
          .slice(0, 300)
          .trim() + "...";

      feed.item({
        title: blog.title,
        id: `${siteUrl}/blogs/${blog.slug}`,
        link: `${siteUrl}/blogs/${blog.slug}`,
        description: plainText,
        date: new Date(blog.created_at),
      });
    });

    const outputPath = path.join(__dirname, "../public/rss.xml");
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, feed.xml({ indent: true }));
    console.log("RSS feed generated successfully");
  } catch (err) {
    console.error("Failed to generate RSS feed:", err.message);
    throw err;
  }
}

module.exports = generateRSS;
