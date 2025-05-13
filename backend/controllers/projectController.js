const pool = require('../db');

// Helper function for error handling
const handleError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        id, name, description, 
        github_link, live_link, article_link,
        tags, tech_stack, is_featured, 
        image_url, created_at
       FROM projects 
       ORDER BY created_at DESC`
    );
    
    res.json({
      success: true,
      message: 'Projects fetched successfully',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    handleError(res, error, 'getProjects');
  }
};

exports.createProject = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      github_link, 
      live_link = null,
      article_link = null, 
      tags = [], 
      tech_stack = [], 
      is_featured = false, 
      image_url = null,
      created_at 
    } = req.body;

    // Validation
    if (!name || !description || !github_link || !created_at) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, GitHub link, and creation date are required'
      });
    }

    // Check if the creation date is in the correct format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(created_at)) {
      return res.status(400).json({
        success: false,
        message: 'Date must be in YYYY-MM-DD format'
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO projects (
        id, name, description, created_at,
        github_link, live_link, article_link,
        tags, tech_stack, is_featured, image_url
      ) VALUES (
        gen_random_uuid(), $1, $2, $3,
        $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
      [
        name, description, created_at,
        github_link, live_link, article_link,
        tags, JSON.stringify(tech_stack), is_featured, image_url
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Project with similar details already exists'
      });
    }
    handleError(res, error, 'createProject');
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      github_link,
      live_link,
      article_link,
      tags,
      tech_stack,
      is_featured,
      image_url,
      created_at
    } = req.body;

    // Basic validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Validate date format if provided
    if (created_at && !/^\d{4}-\d{2}-\d{2}$/.test(created_at)) {
      return res.status(400).json({
        success: false,
        message: 'Date must be in YYYY-MM-DD format'
      });
    }

    // Get existing project first
    const { rows: existingRows } = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Use existing values as fallbacks
    const project = existingRows[0];
    const updatedData = {
      name: name || project.name,
      description: description || project.description,
      github_link: github_link || project.github_link,
      live_link: live_link !== undefined ? live_link : project.live_link,
      article_link: article_link !== undefined ? article_link : project.article_link,
      tags: tags || project.tags,
      tech_stack: tech_stack || project.tech_stack,
      is_featured: is_featured !== undefined ? is_featured : project.is_featured,
      image_url: image_url !== undefined ? image_url : project.image_url,
      created_at: created_at || project.created_at
    };

    const { rows } = await pool.query(
      `UPDATE projects SET
        name = $1,
        description = $2,
        github_link = $3,
        live_link = $4,
        article_link = $5,
        tags = $6,
        tech_stack = $7,
        is_featured = $8,
        image_url = $9,
        created_at = $10
      WHERE id = $11
      RETURNING *`,
      [
        updatedData.name,
        updatedData.description,
        updatedData.github_link,
        updatedData.live_link,
        updatedData.article_link,
        updatedData.tags,
        updatedData.tech_stack,
        updatedData.is_featured,
        updatedData.image_url,
        updatedData.created_at,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Project with similar details already exists'
      });
    }
    handleError(res, error, 'updateProject');
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      'DELETE FROM projects WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    handleError(res, error, 'deleteProject');
  }
};

// Get featured projects
exports.getFeaturedProjects = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        id, name, description, 
        github_link, live_link, article_link,
        tags, tech_stack, image_url
       FROM projects 
       WHERE is_featured = true 
       ORDER BY created_at DESC
       LIMIT 3`
    );

    res.json({
      success: true,
      message: rows.length ? 'Featured projects fetched' : 'No featured projects found',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    handleError(res, error, 'getFeaturedProjects');
  }
};