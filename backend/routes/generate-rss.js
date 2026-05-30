const express = require("express");
const router = express.Router();
const generateRSS = require("../scripts/generate-rss");
const path = require("path");
const fs = require("fs");

// Force regenerate RSS
router.post("/generate-rss", async (req, res) => {
  try {
    await generateRSS();
    res.json({ success: true, message: "RSS feed regenerated" });
  } catch (error) {
    console.error("Error generating RSS:", error);
    res.status(500).json({ error: "Failed to generate RSS feed" });
  }
});

// Serve RSS — regenerate if stale (older than 1 hour) or missing
router.get("/rss.xml", async (req, res) => {
  const rssPath = path.join(__dirname, "../public/rss.xml");

  try {
    // Check if file exists and is fresh (less than 1 hour old)
    let needsRegen = true;
    if (fs.existsSync(rssPath)) {
      const stat = fs.statSync(rssPath);
      const ageMs = Date.now() - stat.mtimeMs;
      needsRegen = ageMs > 60 * 60 * 1000; // older than 1 hour
    }

    if (needsRegen) {
      await generateRSS();
    }

    res.set("Content-Type", "application/rss+xml");
    res.sendFile(rssPath);
  } catch (error) {
    console.error("Error serving RSS:", error);
    res.status(500).json({ error: "Failed to serve RSS feed" });
  }
});

module.exports = router;
