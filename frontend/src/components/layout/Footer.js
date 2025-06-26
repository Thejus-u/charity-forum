import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Donations', href: '/donations' },
      { name: 'Forum', href: '/forum' },
      { name: 'Create Campaign', href: '/donations/create' },
      { name: 'How It Works', href: '/how-it-works' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    community: [
      { name: 'About Us', href: '/about' },
      { name: 'Success Stories', href: '/stories' },
      { name: 'Volunteer', href: '/volunteer' },
      { name: 'Partners', href: '/partners' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com' },
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <FaHeart className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold font-display">
                DonationForum
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering communities to make a difference through meaningful donations 
              and collaborative fundraising. Join us in creating positive change worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="text-gray-400 hover:text-white transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} DonationForum. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                Made with <FaHeart className="inline text-red-500 mx-1" /> for the community
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 