import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMenuHierarchy from '../../hooks/useMenuHierarchy';
import useWebsiteConfig from '../../hooks/useWebsiteConfig';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const { data: websiteData } = useWebsiteConfig();
  const { data: menuData } = useMenuHierarchy();

  const websiteConfig = websiteData?.data;
  const menuItems = menuData?.data?.items || [];

  // Filter menu items for navigation
  const navItems = menuItems.filter((item) => item.displayInNavigation);

  // Build hierarchical structure
  const buildMenuTree = () => {
    const topLevel = navItems.filter((item) => !item.parent_page);
    return topLevel.map((parent) => ({
      ...parent,
      children: navItems.filter((item) => item.parent_page === parent.id),
    }));
  };

  const menuTree = buildMenuTree();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const renderDesktopMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
      return (
        <Link
          key={item.id}
          to={`/${item.url}` || '/'}
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          {item.title}
        </Link>
      );
    }

    return (
      <div key={item.id} className="relative" ref={dropdownRef}>
        <button
          onClick={() => toggleDropdown(item.id)}
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
        >
          {item.title}
          <svg
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${
              openDropdown === item.id ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {openDropdown === item.id && (
          <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {/* Parent link */}
              <Link
                to={`/${item.url}` || '/'}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                onClick={() => setOpenDropdown(null)}
              >
                {item.title} Home
              </Link>
              <div className="border-t border-gray-100"></div>
              {/* Child links */}
              {item.children.map((child) => (
                <Link
                  key={child.id}
                  to={`/${child.url}` || '/'}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setOpenDropdown(null)}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMobileMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
      return (
        <Link
          key={item.id}
          to={`/${item.url}` || '/'}
          className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
          onClick={() => setMobileMenuOpen(false)}
        >
          {item.title}
        </Link>
      );
    }

    return (
      <div key={item.id}>
        <div
          onClick={() => toggleDropdown(item.id)}
          className="flex justify-between items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium cursor-pointer"
        >
          <span>{item.title}</span>
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${
              openDropdown === item.id ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Mobile Submenu */}
        {openDropdown === item.id && (
          <div className="pl-4 py-1 space-y-1">
            <Link
              to={`/${item.url}` || '/'}
              className="block text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.title} Home
            </Link>
            {item.children.map((child) => (
              <Link
                key={child.id}
                to={`/${child.url}` || '/'}
                className="block text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              {websiteConfig?.siteName || 'Mechanics of Motherhood'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-4">
            {menuTree.map(renderDesktopMenuItem)}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuTree.map(renderMobileMenuItem)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
