const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// Add a new blog
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const blog = new Blog({ title, content });
  await blog.save();
  res.json(blog);
});

// Update a blog
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(blog);
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Add a comment to a blog
router.post('/:id/comments', async (req, res) => {
  const { text } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  blog.comments.push({ text });
  await blog.save();
  res.json(blog.comments);
});
module.exports = router;