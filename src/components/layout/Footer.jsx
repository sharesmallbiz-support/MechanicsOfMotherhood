import React from 'react';
import { Link } from 'react-router-dom';
import { useWebsiteConfig } from '../../hooks';

const Footer = () => {
  const { data: websiteData } = useWebsiteConfig();
  const websiteConfig = websiteData?.data;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {websiteConfig?.siteName || 'Mechanics of Motherhood'}
            </h3>
            <p className="text-gray-300 text-sm">
              {websiteConfig?.description ||
                'Your source for delicious recipes and cooking inspiration.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-300 hover:text-white transition-colors">
                  Recipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <p className="text-gray-300 text-sm">
              Powered by WebSpark
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} {websiteConfig?.siteName || 'Mechanics of Motherhood'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
