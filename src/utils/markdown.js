/**
 * Utility functions for markdown processing
 */

/**
 * Strip markdown formatting from text for plain text preview
 * @param {string} markdown - Markdown text
 * @returns {string} Plain text without markdown syntax
 */
export const stripMarkdown = (markdown) => {
  if (!markdown) return '';

  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Remove italic
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove strikethrough
    .replace(/~~(.+?)~~/g, '$1')
    // Remove links but keep text
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.+?\)/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`(.+?)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
};

/**
 * Get plain text preview from markdown
 * @param {string} markdown - Markdown text
 * @param {number} maxLength - Maximum length for preview
 * @returns {string} Plain text preview
 */
export const getMarkdownPreview = (markdown, maxLength = 150) => {
  const plainText = stripMarkdown(markdown);
  return truncateText(plainText, maxLength);
};
