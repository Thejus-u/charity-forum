import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DonationDetail = () => {
  const { id } = useParams();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donateAmount, setDonateAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateError, setDonateError] = useState(null);
  const [donateSuccess, setDonateSuccess] = useState(null);

  const fetchCause = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/causes/${id}`);
      setCause(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cause');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCause();
    // eslint-disable-next-line
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonateError(null);
    setDonateSuccess(null);
    if (!donateAmount || isNaN(donateAmount) || Number(donateAmount) <= 0) {
      setDonateError('Please enter a valid amount.');
      return;
    }
    setDonateLoading(true);
    try {
      await axios.post(`/api/causes/${id}/donate`, {
        amount: Number(donateAmount),
        name: donorName || '',
      });
      setDonateSuccess('Thank you for your donation!');
      setDonateAmount('');
      setDonorName('');
      // Refresh cause data
      fetchCause();
    } catch (err) {
      setDonateError(err.response?.data?.message || 'Donation failed.');
    }
    setDonateLoading(false);
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">Loading cause...</div>;
  }
  if (error) {
    return <div className="max-w-3xl mx-auto py-12 text-center text-error-600">{error}</div>;
  }
  if (!cause) {
    return <div className="max-w-3xl mx-auto py-12 text-center text-gray-400">Cause not found.</div>;
  }

  const percent = Math.min((cause.currentAmount / cause.goalAmount) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">{cause.title}</h2>
      <div className="mb-4 text-gray-700">{cause.description}</div>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{percent.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="font-bold text-lg text-primary-700">₹{cause.currentAmount || 0}</span>
            <span className="text-gray-600 ml-2">raised of ₹{cause.goalAmount} goal</span>
          </div>
        </div>
      </div>
      <div className="mb-2 text-sm text-gray-500">Category: {cause.category}</div>
      <div className="mb-2 text-xs text-gray-400">Cause ID: {cause._id}</div>

      {/* Donation Form */}
      <form onSubmit={handleDonate} className="mt-8 card p-6 max-w-md mx-auto flex flex-col gap-4">
        <h3 className="text-lg font-bold mb-2 text-center">Donate to this Cause</h3>
        <input
          type="number"
          min="1"
          step="any"
          placeholder="Amount (₹)"
          className="input-field"
          value={donateAmount}
          onChange={e => setDonateAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Name (optional)"
          className="input-field"
          value={donorName}
          onChange={e => setDonorName(e.target.value)}
        />
        {donateError && <div className="text-error-600 text-sm text-center">{donateError}</div>}
        {donateSuccess && <div className="text-success-600 text-sm text-center">{donateSuccess}</div>}
        <button type="submit" className="btn-primary w-full" disabled={donateLoading}>
          {donateLoading ? 'Donating...' : 'Donate'}
        </button>
      </form>
    </div>
  );
};

export default DonationDetail; 