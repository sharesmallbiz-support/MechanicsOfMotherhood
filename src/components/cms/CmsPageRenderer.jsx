import React from 'react';
import DOMPurify from 'dompurify';

/**
 * Component to safely render CMS page content (HTML)
 * Uses DOMPurify to sanitize HTML before rendering
 */
const CmsPageRenderer = ({ content, title }) => {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content || '', {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'a', 'strong', 'em', 'u', 's', 'sup', 'sub',
      'blockquote', 'pre', 'code',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'section', 'article',
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'id',
    ],
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {title && (
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
      )}
      <div
        className="prose prose-lg max-w-none cms-content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
};

export default CmsPageRenderer;
