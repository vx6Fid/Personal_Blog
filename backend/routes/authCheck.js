const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.post("/auth/verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: decoded,
    });
  } catch (error) {
    console.error("Unexpected error in token verification:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
