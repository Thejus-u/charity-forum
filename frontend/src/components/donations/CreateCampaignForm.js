import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'medical',
  'education',
  'disaster',
  'community',
  'environment',
  'other',
];

const CreateCampaignForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    goalAmount: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/donations', {
        ...form,
        goalAmount: Number(form.goalAmount),
      });
      navigate('/donations');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to create campaign'
      );
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Start a New Campaign</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="input-field"
        value={form.title}
        onChange={handleChange}
        required
        minLength={5}
        maxLength={200}
      />
      <textarea
        name="description"
        placeholder="Description"
        className="input-field min-h-[100px]"
        value={form.description}
        onChange={handleChange}
        required
        minLength={20}
        maxLength={2000}
      />
      <select
        name="category"
        className="input-field"
        value={form.category}
        onChange={handleChange}
        required
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
      <input
        type="number"
        name="goalAmount"
        placeholder="Goal Amount (₹)"
        className="input-field"
        value={form.goalAmount}
        onChange={handleChange}
        required
        min={1}
      />
      <input
        type="date"
        name="endDate"
        className="input-field"
        value={form.endDate}
        onChange={handleChange}
        required
      />
      {error && <div className="text-error-600 text-sm text-center">{error}</div>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>
    </form>
  );
};

export default CreateCampaignForm; 