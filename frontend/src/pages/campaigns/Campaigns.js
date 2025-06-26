import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/donations');
        setCampaigns(res.data.docs || []);
      } catch (err) {
        setError('Failed to load campaigns');
      }
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto py-12 text-center text-gray-500">Loading campaigns...</div>;
  }
  if (error) {
    return <div className="max-w-5xl mx-auto py-12 text-center text-error-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center">Campaigns</h2>
        <Link to="/campaigns/create" className="btn-primary">Add Campaign</Link>
      </div>
      {campaigns.length === 0 ? (
        <div className="text-gray-400 text-center">No campaigns found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {campaigns.map((c) => {
            const percent = Math.min((c.currentAmount / c.goalAmount) * 100, 100);
            return (
              <div key={c._id} className="card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">{c.title}</h3>
                  <div className="text-gray-600 mb-2 line-clamp-2">{c.description}</div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-primary-700">₹{c.currentAmount || 0}</span>
                      <span className="text-xs text-gray-500">of ₹{c.goalAmount} goal</span>
                    </div>
                  </div>
                </div>
                <Link to={`/donations/${c._id}`} className="btn-primary mt-4 w-full">View Campaign</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Campaigns; 