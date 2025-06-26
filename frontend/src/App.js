import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Donations from './pages/donations/Donations';
import DonationDetail from './pages/donations/DonationDetail';
import CreateDonation from './pages/donations/CreateDonation';
import Forum from './pages/forum/Forum';
import ForumPost from './pages/forum/ForumPost';
import CreatePost from './pages/forum/CreatePost';
import NotFound from './pages/NotFound';
import Campaigns from './pages/campaigns/Campaigns';
import CreateCampaign from './pages/campaigns/CreateCampaign';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col theme-bg px-2 sm:px-0">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/donations/:id" element={<DonationDetail />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumPost />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/donations/create" element={
              <ProtectedRoute>
                <CreateDonation />
              </ProtectedRoute>
            } />
            <Route path="/forum/create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 