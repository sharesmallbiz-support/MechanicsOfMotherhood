import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Markdown renderer component with consistent styling
 * Supports GitHub Flavored Markdown (GFM) including tables, strikethrough, etc.
 */
const Markdown = ({ children, className = '' }) => {
  if (!children) return null

  return (
    <ReactMarkdown
      className={`prose prose-slate max-w-none ${className}`}
      remarkPlugins={[remarkGfm]}
      components={{
        // Customize heading styles
        h1: ({ node, children, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props}>
            {children}
          </h1>
        ),
        h2: ({ node, children, ...props }) => (
          <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-900" {...props}>
            {children}
          </h2>
        ),
        h3: ({ node, children, ...props }) => (
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props}>
            {children}
          </h3>
        ),
        h4: ({ node, children, ...props }) => (
          <h4 className="text-lg font-semibold mt-3 mb-2 text-gray-800" {...props}>
            {children}
          </h4>
        ),
        // Customize paragraph spacing
        p: ({ node, ...props }) => (
          <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
        ),
        // Customize list styles
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="ml-4 text-gray-700" {...props} />
        ),
        // Customize links
        a: ({ node, children, ...props }) => (
          <a
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        ),
        // Customize code blocks
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code
              className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4"
              {...props}
            />
          ),
        // Customize blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-blue-50"
            {...props}
          />
        ),
        // Customize tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-50" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="bg-white divide-y divide-gray-200" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="px-4 py-3 text-sm text-gray-700" {...props} />
        ),
        // Customize horizontal rules
        hr: ({ node, ...props }) => (
          <hr className="my-6 border-gray-300" {...props} />
        ),
        // Customize strong/bold
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-gray-900" {...props} />
        ),
        // Customize emphasis/italic
        em: ({ node, ...props }) => (
          <em className="italic text-gray-700" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
