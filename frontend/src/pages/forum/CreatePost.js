import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'donation-stories', label: 'Donation Stories' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'community', label: 'Community' },
  { value: 'news', label: 'News' },
  { value: 'help', label: 'Help' },
];

const CreatePost = () => {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ title: '', content: '', category: CATEGORIES[0].value });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">New Forum Post</h2>
        <div className="text-error-600 text-lg">You must be logged in to create a post.</div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/forum', {
        title: form.title,
        content: form.content,
        category: form.category,
      });
      navigate('/forum');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to create post'
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">New Forum Post</h2>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input-field"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          className="input-field min-h-[120px]"
          value={form.content}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="input-field"
          value={form.category}
          onChange={handleChange}
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        {error && <div className="text-error-600 text-sm text-center">{error}</div>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 