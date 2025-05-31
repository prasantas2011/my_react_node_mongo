import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global-style.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import Blog from './Blog';

const api = 'http://localhost:5000/api/users';

function Home({ users, form, errors, editingId, handleSubmit, handleEdit, handleDelete, handleCancelEdit, setForm }) {
  return (
    <div className="container">
      <h1 className="mb-4 my-custom-title">User List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <input
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
      <ul className="list-group">
        {users.map(u => (
          <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{u.name} - {u.email}</span>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(u)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get(api).then(res => setUsers(res.data));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Email is invalid';
    }
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
    setForm({ name: '', email: '' });
    const res = await axios.get(api);
    setUsers(res.data);
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`${api}/${id}`);
      setUsers(users.filter(u => u._id !== id));
      if (editingId === id) {
        setForm({ name: '', email: '' });
        setEditingId(null);
        setErrors({});
      }
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: '', email: '' });
    setEditingId(null);
    setErrors({});
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand nav-link-text" to="/">Welcome To Prasanta Page</Link>
          <div>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-row">
              <li className="nav-item me-3">
                <Link className="nav-link nav-link-text" to="/">Home</Link>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link nav-link-text" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-text" to="/blog">Blog</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={
          <Home
            users={users}
            form={form}
            errors={errors}
            editingId={editingId}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleCancelEdit={handleCancelEdit}
            setForm={setForm}
          />
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
  );
}

export default App;