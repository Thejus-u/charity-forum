import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await axios.get('/api/forum');
      setPosts(res.data.docs || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Community Forum</h2>
        {/* <Link to="/forum/create" className="btn-primary">New Post</Link> */}
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400">No posts yet.</div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="card p-4">
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-lg">{post.title}</div>
                <div className="text-xs text-gray-500">by {post.author?.username || (post.author?.firstName ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown')}</div>
              </div>
              <div className="text-gray-700 text-sm mb-2 line-clamp-2">{post.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum; 