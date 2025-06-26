import React from 'react';

// Helper to generate a random pastel color
function getRandomColor(seed) {
  // Simple hash for seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate color
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
}

const TestimonialList = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return <div className="text-gray-400 text-center">No testimonials yet.</div>;
  }
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((t) => {
        const hasAvatar = !!t.user?.avatar;
        const color = getRandomColor(t.user?._id || t._id);
        return (
          <div key={t._id} className="card p-6 flex flex-col items-center">
            {hasAvatar ? (
              <img
                src={t.user.avatar}
                alt={t.user?.username || 'User'}
                className="w-12 h-12 rounded-full mb-2 object-cover border"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full mb-2 border"
                style={{ background: color }}
              ></div>
            )}
            <div className="font-semibold text-gray-900">
              {t.user?.username || (t.user?.firstName ? `${t.user.firstName} ${t.user.lastName}` : 'Anonymous')}
            </div>
            <div className="text-xs text-gray-500 mb-2">{new Date(t.createdAt).toLocaleDateString()}</div>
            <p className="text-gray-600 mb-2 italic text-center">"{t.message}"</p>
          </div>
        );
      })}
    </div>
  );
};

export default TestimonialList; 