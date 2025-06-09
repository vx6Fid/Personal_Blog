const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const generateRSS = require("../scripts/generate-rss");

router.post('/generate-rss', async (req, res) => {
  try {
    await generateRSS()
    res.json({ success: true, message: 'RSS feed generated successfully' });
  } catch (error) {
    console.error('Error generating RSS:', error);
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
});

router.get('/rss.xml', (req, res) => {
  try {
    const rssPath = path.join(__dirname, '../public/rss.xml');
    
    if (!fs.existsSync(rssPath)) {
      return res.status(404).json({ error: 'RSS feed not found' });
    }
    
    res.set('Content-Type', 'application/rss+xml');
    res.sendFile(rssPath);
  } catch (error) {
    console.error('Error serving RSS:', error);
    res.status(500).json({ error: 'Failed to serve RSS feed' });
  }
});


module.exports = router;