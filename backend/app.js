const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use(express.json());

// API routes with rate limiting
app.use("/api/admin", apiLimiter, require("./routes/admin"));
app.use("/api/blogs", apiLimiter, require("./routes/blogs"));
app.use("/api/projects", apiLimiter, require("./routes/projects"));
app.use("/api/contact", apiLimiter, require("./routes/contact"));
app.use("/api", apiLimiter, require("./routes/authCheck"));
app.use("/api", require("./routes/generate-rss"));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

module.exports = app;