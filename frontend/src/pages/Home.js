import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaHandshake, 
  FaUsers, 
  FaGlobe, 
  FaShieldAlt,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import axios from 'axios';
import TestimonialForm from '../components/TestimonialForm';
import TestimonialList from '../components/TestimonialList';

const Home = () => {
  const features = [
    {
      icon: <FaHeart className="text-3xl text-red-500" />,
      title: 'Create Impact',
      description: 'Start meaningful donation campaigns and make a real difference in people\'s lives.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <FaHandshake className="text-3xl text-blue-500" />,
      title: 'Build Community',
      description: 'Connect with like-minded individuals and organizations working towards common goals.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <FaUsers className="text-3xl text-green-500" />,
      title: 'Collaborate Together',
      description: 'Join forces with volunteers and supporters to amplify your impact.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <FaGlobe className="text-3xl text-purple-500" />,
      title: 'Global Reach',
      description: 'Reach supporters worldwide and create campaigns that transcend borders.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Campaigns' },
    { number: '$2M+', label: 'Total Raised' },
    { number: '50K+', label: 'Community Members' },
    { number: '100+', label: 'Countries Reached' }
  ];

  const [causes, setCauses] = useState([]);
  const [loadingCauses, setLoadingCauses] = useState(true);
  const [causesError, setCausesError] = useState(null);

  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState(null);

  useEffect(() => {
    const fetchCauses = async () => {
      setLoadingCauses(true);
      setCausesError(null);
      try {
        const res = await axios.get('/api/causes');
        setCauses(res.data || []);
      } catch (err) {
        setCausesError('Failed to load causes');
      }
      setLoadingCauses(false);
    };
    fetchCauses();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoadingTestimonials(true);
      setTestimonialsError(null);
      try {
        const res = await axios.get('/api/testimonials');
        setTestimonials(res.data || []);
      } catch (err) {
        setTestimonialsError('Failed to load testimonials');
      }
      setLoadingTestimonials(false);
    };
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = (testimonial) => {
    setTestimonials(prev => [testimonial, ...prev]);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold font-display text-gray-900 mb-6">
                Make a{' '}
                <span className="gradient-text">Difference</span>
                <br />
                Together
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join our community of changemakers. Create donation campaigns, 
                support meaningful causes, and build a better world together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/campaigns"
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <span>Explore Campaigns</span>
                  <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  to="/campaigns/create"
                  className="btn-outline text-lg px-8 py-4 flex items-center justify-center"
                >
                  Start Your Campaign
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-large p-8 min-h-[320px] min-w-[320px] flex flex-col justify-between">
                  {loadingCauses ? (
                    <div className="text-center text-gray-400 py-12">Loading cause...</div>
                  ) : causesError ? (
                    <div className="text-center text-error-600 py-12">{causesError}</div>
                  ) : causes.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">No causes found. <br/>Start a campaign to see it here!</div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <FaHeart className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{causes[0].title}</h3>
                          <p className="text-gray-600 line-clamp-2">{causes[0].description}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{Math.round((causes[0].currentAmount / causes[0].goalAmount) * 100) || 0}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${Math.min((causes[0].currentAmount / causes[0].goalAmount) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">₹{causes[0].currentAmount || 0}</p>
                          <p className="text-sm text-gray-600">raised of ₹{causes[0].goalAmount} goal</p>
                        </div>
                        <Link to="/donations" className="btn-primary">Donate Now</Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
              Why Choose DonationForum?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the tools and community you need to create meaningful change 
              and make a lasting impact in the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-medium transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Hear from the amazing people who make our platform special.
            </p>
          </motion.div>
          <TestimonialForm onAdd={handleAddTestimonial} />
          {loadingTestimonials ? (
            <div className="text-center text-gray-400">Loading testimonials...</div>
          ) : testimonialsError ? (
            <div className="text-center text-error-600">{testimonialsError}</div>
          ) : (
            <TestimonialList testimonials={testimonials} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of people who are already creating positive change 
              in the world through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Get Started Today</span>
                <FaArrowRight className="text-sm" />
              </Link>
              <Link
                to="/donations"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Browse Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 