import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Donations = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donateState, setDonateState] = useState({}); // { [causeId]: { amount, name, loading, error, success } }

  useEffect(() => {
    const fetchCauses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/causes');
        setCauses(res.data || []);
      } catch (err) {
        setError('Failed to load causes');
      }
      setLoading(false);
    };
    fetchCauses();
  }, []);

  const handleDonateChange = (causeId, field, value) => {
    setDonateState((prev) => ({
      ...prev,
      [causeId]: {
        ...prev[causeId],
        [field]: value,
      },
    }));
  };

  const handleDonate = async (e, causeId) => {
    e.preventDefault();
    setDonateState((prev) => ({
      ...prev,
      [causeId]: { ...prev[causeId], loading: true, error: null, success: null },
    }));
    const { amount, name } = donateState[causeId] || {};
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setDonateState((prev) => ({
        ...prev,
        [causeId]: { ...prev[causeId], loading: false, error: 'Please enter a valid amount.' },
      }));
      return;
    }
    try {
      await axios.post(`/api/causes/${causeId}/donate`, {
        amount: Number(amount),
        name: name || '',
      });
      setDonateState((prev) => ({
        ...prev,
        [causeId]: { amount: '', name: '', loading: false, error: null, success: 'Thank you for your donation!' },
      }));
      // Refresh causes to update progress
      const res = await axios.get('/api/causes');
      setCauses(res.data || []);
    } catch (err) {
      setDonateState((prev) => ({
        ...prev,
        [causeId]: { ...prev[causeId], loading: false, error: err.response?.data?.message || 'Donation failed.' },
      }));
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto py-12 text-center text-gray-500">Loading causes...</div>;
  }
  if (error) {
    return <div className="max-w-5xl mx-auto py-12 text-center text-error-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Donate to a Cause</h2>
      {causes.length === 0 ? (
        <div className="text-gray-400 text-center">No causes found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {causes.map((cause) => {
            const percent = Math.min((cause.currentAmount / cause.goalAmount) * 100, 100);
            const donate = donateState[cause._id] || {};
            return (
              <div key={cause._id} className="card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">{cause.title}</h3>
                  <div className="text-gray-600 mb-2 line-clamp-2">{cause.description}</div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-primary-700">₹{cause.currentAmount || 0}</span>
                      <span className="text-xs text-gray-500">of ₹{cause.goalAmount} goal</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={(e) => handleDonate(e, cause._id)} className="mt-4 flex flex-col gap-2">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="Amount (₹)"
                    className="input-field"
                    value={donate.amount || ''}
                    onChange={e => handleDonateChange(cause._id, 'amount', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    className="input-field"
                    value={donate.name || ''}
                    onChange={e => handleDonateChange(cause._id, 'name', e.target.value)}
                  />
                  {donate.error && <div className="text-error-600 text-xs text-center">{donate.error}</div>}
                  {donate.success && <div className="text-success-600 text-xs text-center">{donate.success}</div>}
                  <button type="submit" className="btn-primary w-full" disabled={donate.loading}>
                    {donate.loading ? 'Donating...' : 'Donate'}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Donations; 