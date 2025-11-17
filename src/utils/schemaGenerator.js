/**
 * Utility functions for generating Schema.org JSON-LD structured data
 */

import { getUniqueRecipeSlug } from './slugify';

/**
 * Generate Recipe schema for rich search results
 * @param {Object} recipe - Recipe data object
 * @returns {Object} Recipe schema object
 */
export const generateRecipeSchema = (recipe) => {
  if (!recipe) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description || '',
  };

  // Add canonical URL using generated slug for SEO
  const slug = getUniqueRecipeSlug(recipe);
  if (slug) {
    schema.url = `https://mechanicsofmotherhood.com/recipes/${slug}`;
  }

  // Add author if available
  if (recipe.authorNM) {
    schema.author = {
      '@type': 'Person',
      name: recipe.authorNM,
    };
  }

  // Add servings/yield
  if (recipe.servings) {
    schema.recipeYield = `${recipe.servings} servings`;
  }

  // Add ingredients as array (parse from markdown)
  if (recipe.ingredients) {
    schema.recipeIngredient = parseIngredientsFromMarkdown(recipe.ingredients);
  }

  // Add instructions as HowToStep array (parse from markdown)
  if (recipe.instructions) {
    schema.recipeInstructions = parseInstructionsFromMarkdown(recipe.instructions);
  }

  // Add image if available
  if (recipe.imageUrl) {
    schema.image = recipe.imageUrl;
  }

  // Add times if available (would need to be added to API)
  if (recipe.prepTime) {
    schema.prepTime = recipe.prepTime; // ISO 8601 duration format (e.g., "PT15M")
  }

  if (recipe.cookTime) {
    schema.cookTime = recipe.cookTime; // ISO 8601 duration format (e.g., "PT30M")
  }

  if (recipe.totalTime) {
    schema.totalTime = recipe.totalTime;
  } else if (recipe.prepTime && recipe.cookTime) {
    // Calculate total time if both prep and cook are provided
    const prepMinutes = parseDuration(recipe.prepTime);
    const cookMinutes = parseDuration(recipe.cookTime);
    if (prepMinutes && cookMinutes) {
      schema.totalTime = `PT${prepMinutes + cookMinutes}M`;
    }
  }

  // Add category/cuisine if available
  if (recipe.category) {
    schema.recipeCategory = recipe.category;
  }

  if (recipe.cuisine) {
    schema.recipeCuisine = recipe.cuisine;
  }

  // Add keywords
  if (recipe.tags && Array.isArray(recipe.tags)) {
    schema.keywords = recipe.tags.join(', ');
  }

  // Add ratings if available
  if (recipe.rating && recipe.ratingCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating,
      ratingCount: recipe.ratingCount,
    };
  }

  // Add nutrition information if available
  if (recipe.nutrition) {
    schema.nutrition = {
      '@type': 'NutritionInformation',
      calories: recipe.nutrition.calories || undefined,
      proteinContent: recipe.nutrition.protein || undefined,
      fatContent: recipe.nutrition.fat || undefined,
      carbohydrateContent: recipe.nutrition.carbohydrates || undefined,
    };
  }

  return schema;
};

/**
 * Parse ingredients from markdown format
 * @param {string} markdown - Ingredients in markdown format
 * @returns {Array<string>} Array of ingredient strings
 */
const parseIngredientsFromMarkdown = (markdown) => {
  if (!markdown) return [];

  // Extract list items from markdown
  const lines = markdown.split('\n');
  const ingredients = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    // Match unordered list items (-, *, +) or ordered list items (1., 2., etc.)
    const match = trimmed.match(/^[-*+]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    if (match) {
      ingredients.push(match[1].trim());
    } else if (trimmed && !trimmed.startsWith('#')) {
      // Include non-list items that aren't headers
      ingredients.push(trimmed);
    }
  });

  return ingredients;
};

/**
 * Parse instructions from markdown format into HowToStep array
 * @param {string} markdown - Instructions in markdown format
 * @returns {Array<Object>} Array of HowToStep objects
 */
const parseInstructionsFromMarkdown = (markdown) => {
  if (!markdown) return [];

  // Extract list items from markdown
  const lines = markdown.split('\n');
  const instructions = [];
  let stepNumber = 1;

  lines.forEach((line) => {
    const trimmed = line.trim();
    // Match unordered list items (-, *, +) or ordered list items (1., 2., etc.)
    const match = trimmed.match(/^[-*+]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    if (match) {
      instructions.push({
        '@type': 'HowToStep',
        position: stepNumber++,
        text: match[1].trim(),
      });
    } else if (trimmed && !trimmed.startsWith('#')) {
      // Include non-list items that aren't headers as steps
      instructions.push({
        '@type': 'HowToStep',
        position: stepNumber++,
        text: trimmed,
      });
    }
  });

  return instructions;
};

/**
 * Parse ISO 8601 duration to minutes
 * @param {string} duration - ISO 8601 duration (e.g., "PT15M", "PT1H30M")
 * @returns {number|null} Duration in minutes
 */
const parseDuration = (duration) => {
  if (!duration) return null;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);

  return hours * 60 + minutes;
};

/**
 * Generate Organization schema for homepage
 * @param {Object} config - Website configuration
 * @returns {Object} Organization schema object
 */
export const generateOrganizationSchema = (config = {}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name || 'Mechanics of Motherhood',
    description: config.description || 'Delicious family recipes and cooking tips for busy moms.',
    url: 'https://mechanicsofmotherhood.com',
    logo: 'https://mechanicsofmotherhood.com/logo.png',
    sameAs: [
      // Add social media links when available
      'https://www.facebook.com/mechanicsofmotherhood',
      'https://www.instagram.com/mechanicsofmotherhood',
      'https://www.pinterest.com/mechanicsofmotherhood',
    ].filter(Boolean),
  };
};

/**
 * Generate BreadcrumbList schema for navigation
 * @param {Array} breadcrumbs - Array of breadcrumb items [{name, url}, ...]
 * @returns {Object} BreadcrumbList schema object
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://mechanicsofmotherhood.com${item.url}`,
    })),
  };
};

/**
 * Generate WebSite schema with search action
 * @returns {Object} WebSite schema object
 */
export const generateWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mechanics of Motherhood',
    url: 'https://mechanicsofmotherhood.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mechanicsofmotherhood.com/recipes?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
};
