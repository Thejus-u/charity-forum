import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TestimonialForm = ({ onAdd }) => {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/testimonials', { message });
      setMessage('');
      if (onAdd) onAdd(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit testimonial');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center">
      <textarea
        className="input-field w-full max-w-xl mb-2"
        placeholder="Share your experience with the community..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        minLength={5}
        maxLength={1000}
        required
      />
      {error && <div className="text-error-600 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn-primary" disabled={loading || !message.trim()}>
        {loading ? 'Submitting...' : 'Submit Testimonial'}
      </button>
    </form>
  );
};

export default TestimonialForm; 