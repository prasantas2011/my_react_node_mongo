import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './blog.css';

const api = 'http://localhost:5000/api/blogs';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [localReplyText, setLocalReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api);
      setBlogs(res.data);
    } catch (err) {
      alert('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.content.trim()) errs.content = 'Content is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (editingId) {
      await axios.put(`${api}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(api, form);
    }
    setForm({ title: '', content: '' });
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content });
    setEditingId(blog._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await axios.delete(`${api}/${id}`);
      setBlogs(blogs.filter(b => b._id !== id));
      if (editingId === id) {
        setForm({ title: '', content: '' });
        setEditingId(null);
        setErrors({});
      }
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: '', content: '' });
    setEditingId(null);
    setErrors({});
  };

  // Save comment to DB
  const handleReplySubmit = async (blogId, e) => {
    e.preventDefault();
    const text = localReplyText[blogId]?.trim();
    if (!text) {
        alert('Reply cannot be empty!');
        return;
    }
    await axios.post(`${api}/${blogId}/comments`, { text });
    setLocalReplyText(prev => ({ ...prev, [blogId]: '' }));
    fetchBlogs();
  };

return (
    <div className="container mt-5">
        <h1 className="mb-4 my-custom-title">Blog</h1>
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <input
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            <div className="mb-3">
                <textarea
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    placeholder="Content"
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    rows={4}
                />
                {errors.content && <div className="invalid-feedback">{errors.content}</div>}
            </div>
            <button type="submit" className="btn btn-primary me-2">
                {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                </button>
            )}
        </form>
        {loading ? (
          <div className="text-center my-4">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="alert alert-info">No blog posts yet. Be the first to add one!</div>
        ) : (
          <ul className="list-group">
              {blogs.map(blog => (
                  <li key={blog._id} className="blog-list-item d-flex justify-content-between align-items-start">
                      <div style={{ flex: 1 }}>
                          <h5>{blog.title}</h5>
                          <p>{blog.content}</p>
                          {/* Comment List */}
                          <ul className="list-unstyled ms-2">
                            {(blog.comments && blog.comments.length > 0) ? (
                              blog.comments.map((c, idx) => (
                                <li key={idx} className="text-secondary small mb-1">
                                  💬 {c.text}
                                  {c.createdAt && (
                                    <span className="ms-2 text-muted" style={{ fontSize: '0.8em' }}>
                                      {new Date(c.createdAt).toLocaleString()}
                                    </span>
                                  )}
                                </li>
                              ))
                            ) : (
                              <li className="text-muted small">No comments yet.</li>
                            )}
                          </ul>
                          {/* Reply Form */}
                          <form className="d-flex mt-2" onSubmit={e => handleReplySubmit(blog._id, e)}>
                              <textarea
                                className="form-control form-control-sm me-2 reply-textarea"
                                placeholder="Write a reply..."
                                value={localReplyText[blog._id] || ''}
                                onChange={e => setLocalReplyText(prev => ({ ...prev, [blog._id]: e.target.value }))}
                                rows={2}
                                style={{ resize: 'vertical' }}
                              />
                              <button
                                type="submit"
                                className="btn btn-sm btn-success ms-2"
                                disabled={!localReplyText[blog._id] || !localReplyText[blog._id].trim()}
                              >
                                Reply
                              </button>
                          </form>
                      </div>
                      <div className="blog-list-actions ms-3">
                          <button className="btn btn-warning btn-sm mb-2" onClick={() => handleEdit(blog)}>
                              Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(blog._id)}>
                              Delete
                          </button>
                      </div>
                  </li>
              ))}
          </ul>
        )}
    </div>
);
}