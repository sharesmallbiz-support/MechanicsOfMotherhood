import React from 'react';
import { Link } from 'react-router-dom';
import SchemaMarkup from '../seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '../../utils/schemaGenerator';

/**
 * Breadcrumb navigation component with BreadcrumbList schema
 * @param {Array} items - Array of breadcrumb items [{name, path}, ...]
 */
const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Ensure home is always the first breadcrumb
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...items,
  ];

  // Remove duplicate home entries
  const uniqueItems = breadcrumbItems.reduce((acc, item) => {
    if (item.path === '/' && acc.some(i => i.path === '/')) {
      return acc;
    }
    return [...acc, item];
  }, []);

  // Generate schema for SEO
  const breadcrumbSchema = generateBreadcrumbSchema(
    uniqueItems.map(item => ({ name: item.name, url: item.path }))
  );

  return (
    <>
      {/* BreadcrumbList Schema */}
      {breadcrumbSchema && <SchemaMarkup schema={breadcrumbSchema} />}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {uniqueItems.map((item, index) => {
            const isLast = index === uniqueItems.length - 1;

            return (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 mx-2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {isLast ? (
                  <span
                    className="font-medium text-gray-900"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
