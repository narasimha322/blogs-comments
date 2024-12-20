const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all comments for a specific blog (Public for everyone)
router.get('/:blogId', async (req, res) => {
  const { blogId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at DESC', [blogId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new comment (Accessible by any logged-in user)
router.post('/:blogId', authenticateToken, async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO comments (blog_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [blogId, userId, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a comment (only allowed for the user who created the comment)
router.put('/:commentId', authenticateToken, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = await pool.query('SELECT * FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
    if (comment.rows.length === 0) {
      return res.status(403).json({ error: 'You can only update your own comments' });
    }

    const result = await pool.query(
      'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
      [content, commentId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a comment (only allowed for the user who created the comment)
router.delete('/:commentId', authenticateToken, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await pool.query('SELECT * FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
    if (comment.rows.length === 0) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
