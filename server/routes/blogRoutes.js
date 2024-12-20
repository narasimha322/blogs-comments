const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Get All Blogs (Public for everyone)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        blogs.*, 
        users.username AS author 
      FROM blogs
      JOIN users ON blogs.user_id = users.id
      ORDER BY blogs.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// Get Single Blog by ID (Public for everyone)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        blogs.*, 
        users.username AS author 
      FROM blogs
      JOIN users ON blogs.user_id = users.id
      WHERE blogs.id = $1
    `, [req.params.id]);

    if (!result.rows.length) return res.status(404).json({ error: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blog' });
  }
});

// Create Blog (Accessible by logged-in users)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO blogs (user_id, title, content, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, content, category, imageUrl]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Error creating blog' });
  }
});

// Update Blog (Only by the owner)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (!blog.rows.length) return res.status(403).json({ error: 'You can only update your own blogs' });

    const updateResult = await pool.query(
      'UPDATE blogs SET title = $1, content = $2, category = $3, image_url = COALESCE($4, image_url) WHERE id = $5 RETURNING *',
      [title, content, category, imageUrl, req.params.id]
    );
    res.json(updateResult.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Error updating blog' });
  }
});

// Delete Blog (Only by the owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (!blog.rows.length) return res.status(403).json({ error: 'You can only delete your own blogs' });

    await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting blog' });
  }
});

module.exports = router;
