import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Component to safely render CMS page content (Markdown)
 * Uses react-markdown to convert Markdown to HTML
 */
const CmsPageRenderer = ({ content, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {title && (
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
      )}
      <div className="prose prose-lg max-w-none cms-content">
        <ReactMarkdown>{content || ''}</ReactMarkdown>
      </div>
    </div>
  );
};

export default CmsPageRenderer;
