const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function for error handling
const handleError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({ message: 'Server Error' });
};

// Helper function for validating required fields
const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({ message: `${key} is required` });
      return false;
    }
  }
  return true;
};

// Login Admin (unchanged)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!validateFields({ username, password }, res)) return;
    const { rows } = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    
    const validPass = await bcrypt.compare(password, rows[0].password_hash);
    if (!validPass) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (error) {
    handleError(res, error, 'login');
  }
};

// Get ALL admin data in one query
exports.getAdminData = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        about_mobile,
        about_desktop, 
        doing_content, 
        doing_date, 
        software_tools, 
        hardware_tools, 
        extras 
      FROM admin 
      WHERE id = 1
    `);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin record not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    handleError(res, error, 'getAdminData');
  }
};

// Generic UPDATE function for single fields
const updateAdminField = async (req, res, fieldName) => {
  const fieldValue = req.body[fieldName];
  try {
    if (!validateFields({ [fieldName]: fieldValue }, res)) return;
    
    const { rows } = await pool.query(
      `UPDATE admin SET ${fieldName} = $1 WHERE id = 1 RETURNING ${fieldName}`,
      [fieldValue]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin record not found' });
    }
    
    res.json({ 
      message: `${fieldName.replace('_', ' ')} updated successfully`,
      [fieldName]: rows[0][fieldName]
    });
  } catch (error) {
    handleError(res, error, `update${fieldName}`);
  }
};

// Special case for updating "doing" (two fields)
exports.updateDoing = async (req, res) => {
  const { content, date } = req.body.doing || {};
  try {
    if (!validateFields({ content, date }, res)) return;
    
    const { rows } = await pool.query(
      `UPDATE admin 
       SET doing_content = $1, doing_date = $2 
       WHERE id = 1 
       RETURNING doing_content, doing_date`,
      [content, date]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin record not found' });
    }
    
    res.json({ 
      message: 'Doing updated successfully',
      doing: rows[0]
    });
  } catch (error) {
    handleError(res, error, 'updateDoing');
  }
};

// Update endpoints (reuse the generic update function)
exports.updateAboutM = async (req, res) => await updateAdminField(req, res, 'about_mobile');
exports.updateAboutD = async (req, res) => await updateAdminField(req, res, 'about_desktop');
exports.updateSoftwareTools = async (req, res) => await updateAdminField(req, res, 'software_tools');
exports.updateHardwareTools = async (req, res) => await updateAdminField(req, res, 'hardware_tools');
exports.updateExtras = async (req, res) => await updateAdminField(req, res, 'extras');
// Bulk update admin data
exports.updateAdminData = async (req, res) => {
  const {
    about_mobile,
    about_desktop,
    doing,
    software_tools,
    hardware_tools,
    extras
  } = req.body;

  try {
    const { rows } = await pool.query(`
      UPDATE admin SET
        about_mobile = COALESCE($1, about_mobile),
        about_desktop = COALESCE($1, about_desktop),
        doing_content = COALESCE($2, doing_content),
        doing_date = COALESCE($3, doing_date),
        software_tools = COALESCE($4, software_tools),
        hardware_tools = COALESCE($5, hardware_tools),
        extras = COALESCE($6, extras)
      WHERE id = 1
      RETURNING *
    `, [
      about_mobile,
      about_desktop,
      doing?.content,
      doing?.date,
      software_tools,
      hardware_tools,
      extras
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin record not found' });
    }

    res.json({
      message: 'Admin data updated successfully',
      data: rows[0]
    });
  } catch (error) {
    handleError(res, error, 'updateAdminData');
  }
};