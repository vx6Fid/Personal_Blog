const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/auth');

router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getBlogBySlug);
router.post('/', authMiddleware, blogController.createBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);
router.get('/featured/blog', blogController.getFeaturedBlog);
router.put('/:id', authMiddleware, blogController.updateBlog);

module.exports = router;
