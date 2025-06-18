const pool = require("../db");
const generateRSS = require("../scripts/generate-rss");

// Helper function for error handling
const handleError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({ message: "Server Error" });
};

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, content, slug, tags, created_at, is_featured, read_time FROM blog_posts ORDER BY created_at DESC",
    );
    res.json({
      message: "Blogs fetched successfully",
      blogs: rows,
    });
  } catch (error) {
    handleError(res, error, "getBlogs");
  }
};

// Get recent blogs
exports.getRecentBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const { rows } = await pool.query(
      "SELECT title, slug, created_at FROM blog_posts ORDER BY created_at DESC LIMIT $1",
      [limit],
    );
    res.json({
      message: "Recent blogs fetched successfully",
      blogs: rows,
    });
  } catch (error) {
    handleError(res, error, "getRecentBlogs");
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM blog_posts WHERE slug = $1",
      [slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error, "getBlogBySlug");
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, slug, tags, content, is_featured = false } = req.body;

    // Basic validation
    if (!title || !slug || !content) {
      return res
        .status(400)
        .json({ message: "Title, slug, and content are required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO blog_posts (
        id, title, slug, tags, content,
        created_at, updated_at, is_featured
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4,
        NOW(), NOW(), $5
      ) RETURNING *`,
      [title, slug, tags, content, is_featured],
    );

    // Generate RSS feed after successful blog creation
    try {
      await generateRSS();
      console.log("RSS feed updated successfully");
    } catch (rssError) {
      console.log("Failed to update RSS feed:", rssError);
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation (duplicate slug)
      return res.status(400).json({ message: "Slug already exists" });
    }
    handleError(res, error, "createBlog");
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { id, title, slug, tags, content, is_featured, read_time } = req.body;

    // Basic validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog post ID is required",
      });
    }

    // Check if blog exists
    const { rows: existingBlog } = await pool.query(
      "SELECT * FROM blog_posts WHERE id = $1",
      [id],
    );

    if (existingBlog.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check for slug conflict (if slug is being updated)
    if (slug && slug !== existingBlog[0].slug) {
      const { rows: slugCheck } = await pool.query(
        "SELECT id FROM blog_posts WHERE slug = $1 AND id != $2",
        [slug, id],
      );

      if (slugCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    // Update with provided values or keep existing ones
    const updatedData = {
      title: title || existingBlog[0].title,
      slug: slug || existingBlog[0].slug,
      tags: tags || existingBlog[0].tags,
      content: content || existingBlog[0].content,
      read_time: read_time || existingBlog[0].read_time,
      is_featured:
        is_featured !== undefined ? is_featured : existingBlog[0].is_featured,
    };

    const { rows } = await pool.query(
      `UPDATE blog_posts SET
        title = $1,
        slug = $2,
        tags = $3,
        content = $4,
        is_featured = $5,
        read_time = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *`,
      [
        updatedData.title,
        updatedData.slug,
        updatedData.tags,
        updatedData.content,
        updatedData.is_featured,
        updatedData.read_time,
        id,
      ],
    );

    res.json({
      success: true,
      message: "Blog post updated successfully",
      data: rows[0],
    });
  } catch (error) {
    handleError(res, error, "updateBlog");
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM blog_posts WHERE id = $1",
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    handleError(res, error, "deleteBlog");
  }
};

// Get featured blog
exports.getFeaturedBlog = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blog_posts WHERE is_featured = true ORDER BY created_at DESC LIMIT 1",
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No featured blog found" });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error, "getFeaturedBlog");
  }
};
