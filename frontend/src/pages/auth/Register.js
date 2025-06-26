import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await register(form);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="card p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up for DonationForum</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input-field flex-1"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input-field flex-1"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {error && <div className="text-error-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center text-gray-500 mt-4 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register; 