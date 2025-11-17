/**
 * Utility functions for generating URL-safe slugs
 */

/**
 * Convert a string to a URL-safe slug
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-safe slug
 *
 * @example
 * slugify("Mom's Best Chocolate Chip Cookies!") // "moms-best-chocolate-chip-cookies"
 * slugify("Gluten-Free Pizza (New!)") // "gluten-free-pizza-new"
 */
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove apostrophes
    .replace(/'/g, '')
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^\w-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate a slug from a recipe object
 * Uses recipe.slug if available, otherwise generates from recipe.name
 * @param {Object} recipe - Recipe object
 * @returns {string} URL-safe slug
 */
export const getRecipeSlug = (recipe) => {
  if (!recipe) return '';

  // Use API-provided slug if available
  if (recipe.slug) {
    return recipe.slug;
  }

  // Generate slug from recipe name
  if (recipe.name) {
    return slugify(recipe.name);
  }

  // Fallback to ID if no name is available
  return recipe.id?.toString() || '';
};

/**
 * Generate a unique slug by appending ID if needed
 * This ensures uniqueness even if two recipes have the same name
 * @param {Object} recipe - Recipe object
 * @returns {string} Unique URL-safe slug
 */
export const getUniqueRecipeSlug = (recipe) => {
  if (!recipe) return '';

  const baseSlug = getRecipeSlug(recipe);

  // If we have an API-provided slug, trust it's unique
  if (recipe.slug) {
    return baseSlug;
  }

  // For generated slugs, append ID to ensure uniqueness
  return `${baseSlug}-${recipe.id}`;
};

/**
 * Extract recipe ID from a slug that includes it
 * @param {string} slug - Slug that may include ID (e.g., "chocolate-cookies-123")
 * @returns {number|null} Recipe ID or null if not found
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;

  // Match one or more digits at the end of the slug after a hyphen
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};
