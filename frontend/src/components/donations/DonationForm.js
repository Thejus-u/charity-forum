import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];
const FREQUENCIES = [
  { value: 'one-time', label: 'One-time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const DonationForm = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [causes, setCauses] = useState([]);
  const [selectedCauseId, setSelectedCauseId] = useState('');
  const [selectedCause, setSelectedCause] = useState(null);
  const [frequency, setFrequency] = useState('one-time');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch causes from backend
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

  // Update selected cause object
  useEffect(() => {
    setSelectedCause(causes.find(c => c._id === selectedCauseId) || null);
  }, [selectedCauseId, causes]);

  const handlePresetClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!selectedCauseId || !amount || isNaN(amount) || amount <= 0) {
      setError('Please select a cause and enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/causes/${selectedCauseId}/donate`, {
        amount: Number(amount),
        message: '',
        isAnonymous: false,
      });
      setSuccess('Thank you for your donation!');
      // Refresh causes to update progress
      const res = await axios.get('/api/causes');
      setCauses(res.data || []);
      setAmount('');
      setCustomAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center">
      {/* Donation Form */}
      <form onSubmit={handleSubmit} className="card w-full max-w-xl min-h-[500px] min-w-[500px] aspect-square mx-auto flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span role="img" aria-label="heart">💛</span> Make a Donation
        </h2>
        <p className="text-gray-600 mb-6">Your generosity creates lasting impact</p>

        {/* Select Amount */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Select Amount</label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {PRESET_AMOUNTS.map((val) => (
              <button
                type="button"
                key={val}
                className={`py-2 rounded-lg font-semibold transition-colors duration-150 border border-gray-200 text-gray-700 bg-white/80 hover:bg-primary-50 focus:outline-none ${amount == val ? 'ring-2 ring-primary-400 bg-primary-100 text-primary-700' : ''}`}
                onClick={() => handlePresetClick(val)}
              >
                ₹{val}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            step="any"
            placeholder="Enter amount"
            className="input-field"
            value={customAmount}
            onChange={handleCustomAmount}
          />
        </div>

        {/* Choose Cause */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Choose Cause <span className="text-primary-500">*</span></label>
          <select
            className="input-field"
            value={selectedCauseId}
            onChange={e => setSelectedCauseId(e.target.value)}
            required
          >
            <option value="">Select a cause to support</option>
            {causes.map((cause) => (
              <option key={cause._id} value={cause._id}>
                {cause.title || 'Untitled Cause'}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="mt-2 text-xs text-primary-500 hover:underline"
            onClick={async () => {
              setLoading(true);
              const res = await axios.get('/api/causes');
              setCauses(res.data || []);
              setLoading(false);
            }}
          >
            &#x21bb; Refresh
          </button>
        </div>

        {/* Donation Frequency */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Donation Frequency</label>
          <select
            className="input-field"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            {FREQUENCIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {error && <div className="text-error-600 text-sm text-center mb-2">{error}</div>}
        {success && <div className="text-success-600 text-sm text-center mb-2">{success}</div>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold btn-primary mt-2"
          disabled={loading || !amount || !selectedCauseId}
        >
          {loading ? 'Processing...' : 'Donate'}
        </button>
      </form>

      {/* Cause Progress */}
      <div className="card w-full max-w-xl min-h-[500px] min-w-[500px] aspect-square mx-auto flex-1 flex flex-col gap-4 overflow-y-auto max-h-[600px]">
        <h3 className="text-lg font-bold mb-2 text-center">All Causes</h3>
        {causes.length === 0 && (
          <div className="text-gray-400 text-center">No causes found.</div>
        )}
        {causes.map((cause) => (
          <div
            key={cause._id}
            className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${selectedCauseId === cause._id ? 'border-primary-500 bg-primary-50/60 shadow-lg' : 'border-gray-200 bg-white/70 hover:bg-primary-50/40'}`}
            onClick={() => setSelectedCauseId(cause._id)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold text-primary-700 text-base">{cause.title}</div>
              <div className="text-xs text-gray-500">{cause.category}</div>
            </div>
            <div className="text-gray-600 text-sm mb-2">{cause.description}</div>
            <div className="w-full mb-1">
              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                <span>Progress</span>
                <span>{`₹${cause.currentAmount || 0} / ₹${cause.goalAmount}`}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min((cause.currentAmount / cause.goalAmount) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{cause.supporters?.length || 0} supporters</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationForm; 