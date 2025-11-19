/**
 * Sitemap Generator Script
 *
 * This script fetches all recipes from the API and generates an XML sitemap
 * Run with: node scripts/generateSitemap.js
 *
 * For production, this should be run:
 * - After build
 * - As a scheduled task (daily/weekly)
 * - When content is updated via webhooks
 */

/* eslint-disable no-console */


import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import slugify utility (use simple version for Node.js)
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/'/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getUniqueRecipeSlug = (recipe) => {
  if (!recipe) return '';
  if (recipe.slug) return recipe.slug;
  const baseSlug = recipe.name ? slugify(recipe.name) : '';
  return `${baseSlug}-${recipe.id}`;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE_URL = 'https://webspark.markhazleton.com/api';
const SITE_URL = 'https://mechanicsofmotherhood.com';
const WEBSITE_ID = 2;

// Import local data as fallback
import { readFileSync } from 'fs';
const localRecipesPath = join(__dirname, '..', 'src', 'data', 'recipes-list.json');
const localMenuPath = join(__dirname, '..', 'src', 'data', 'menu-hierarchy.json');

/**
 * Load recipes from local JSON file
 */
function loadLocalRecipes() {
  try {
    const data = readFileSync(localRecipesPath, 'utf-8');
    const recipesData = JSON.parse(data);
    
    if (recipesData.success && Array.isArray(recipesData.data)) {
      return recipesData.data;
    }
    return [];
  } catch (error) {
    console.warn('Could not load local recipes:', error.message);
    return [];
  }
}

/**
 * Fetch all recipes from the API or use local fallback
 */
async function fetchAllRecipes() {
  try {
    console.log('Attempting to fetch from:', `${API_BASE_URL}/recipespark/recipes?pageSize=1000`);
    
    // Try API first with correct endpoint - fetch all pages
    let allRecipes = [];
    let currentPage = 1;
    let hasMore = true;
    
    while (hasMore && currentPage <= 20) { // Safety limit of 20 pages
      const response = await fetch(
        `${API_BASE_URL}/recipespark/recipes?pageNumber=${currentPage}&pageSize=100`
      );
      
      // Check if response is ok before parsing
      if (!response.ok) {
        if (currentPage === 1) {
          console.warn(`API returned status ${response.status}. Using local fallback.`);
          return loadLocalRecipes();
        }
        break; // Stop fetching more pages
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (currentPage === 1) {
          console.warn('API did not return JSON. Using local fallback.');
          return loadLocalRecipes();
        }
        break;
      }
      
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        allRecipes = allRecipes.concat(data.data);
        
        // Check if there are more pages
        if (data.pagination && data.pagination.hasNext) {
          currentPage++;
        } else {
          hasMore = false;
        }
      } else {
        if (currentPage === 1) {
          console.warn('API response format unexpected. Using local fallback.');
          return loadLocalRecipes();
        }
        break;
      }
    }
    
    if (allRecipes.length > 0) {
      console.log(`✓ Fetched ${allRecipes.length} recipes from API (${currentPage} pages)`);
      return allRecipes;
    }
    
    console.warn('No recipes fetched from API. Using local fallback.');
    return loadLocalRecipes();
  } catch (error) {
    console.warn('Could not fetch recipes from API:', error.message);
    console.log('Using local recipe data...');
    return loadLocalRecipes();
  }
}

/**
 * Load menu items from local JSON file
 */
function loadLocalMenu() {
  try {
    const data = readFileSync(localMenuPath, 'utf-8');
    const menuData = JSON.parse(data);
    
    // Handle both flat array and nested structure
    if (menuData.success) {
      if (Array.isArray(menuData.data)) {
        return menuData.data;
      } else if (menuData.data && Array.isArray(menuData.data.items)) {
        return menuData.data.items;
      }
    }
    return [];
  } catch (error) {
    console.warn('Could not load local menu:', error.message);
    return [];
  }
}

/**
 * Fetch menu items for dynamic CMS pages or use local fallback
 */
async function fetchMenuItems() {
  try {
    console.log('Attempting to fetch from:', `${API_BASE_URL}/webcms/websites/${WEBSITE_ID}/menu-hierarchy`);
    
    // Try API first with correct endpoint
    const response = await fetch(`${API_BASE_URL}/webcms/websites/${WEBSITE_ID}/menu-hierarchy`);
    
    // Check if response is ok before parsing
    if (!response.ok) {
      console.warn(`API returned status ${response.status}. Using local fallback.`);
      return loadLocalMenu();
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('API did not return JSON. Using local fallback.');
      return loadLocalMenu();
    }
    
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      console.log(`✓ Fetched ${data.data.length} menu items from API`);
      return data.data;
    }
    
    console.warn('API response format unexpected. Using local fallback.');
    return loadLocalMenu();
  } catch (error) {
    console.warn('Could not fetch menu items from API:', error.message);
    console.log('Using local menu data...');
    return loadLocalMenu();
  }
}

/**
 * Format date to W3C Datetime format (ISO 8601)
 */
function formatDate(date) {
  return date.toISOString();
}

/**
 * Generate sitemap URL entry
 */
function generateUrlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.5') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate complete sitemap XML
 */
async function generateSitemap() {
  console.log('Generating sitemap...');

  const now = formatDate(new Date());
  const urls = [];

  // Homepage
  urls.push(generateUrlEntry(
    SITE_URL,
    now,
    'daily',
    '1.0'
  ));

  // Recipe list page
  urls.push(generateUrlEntry(
    `${SITE_URL}/recipes`,
    now,
    'daily',
    '0.9'
  ));

  // Fetch and add all recipes
  console.log('Fetching recipes...');
  const recipes = await fetchAllRecipes();
  console.log(`Found ${recipes.length} recipes`);

  recipes.forEach(recipe => {
    const lastmod = recipe.modifiedDT
      ? formatDate(new Date(recipe.modifiedDT))
      : now;

    // Generate SEO-friendly slug from recipe name
    const recipeSlug = getUniqueRecipeSlug(recipe);

    urls.push(generateUrlEntry(
      `${SITE_URL}/recipes/${recipeSlug}`,
      lastmod,
      'weekly',
      '0.8'
    ));
  });

  // Fetch and add CMS pages
  console.log('Fetching CMS pages...');
  const menuItems = await fetchMenuItems();
  console.log(`Found ${menuItems.length} menu items`);

  // Flatten menu hierarchy and extract pages with URLs
  const extractPages = (items) => {
    const pages = [];
    items.forEach(item => {
      // Add the current item if it has a valid URL
      if (item.url && item.url !== '/' && item.url !== 'recipe') {
        const linkUrl = item.linkUrl || item.url;
        // Skip recipe controller pages as they're handled separately
        if (!linkUrl.startsWith('/recipe/') && linkUrl !== '/recipe' && linkUrl !== 'recipe') {
          pages.push({
            url: linkUrl.startsWith('/') ? linkUrl : `/${linkUrl}`,
            lastmod: item.modifiedDT || item.modified || item.modified_w3c
              ? formatDate(new Date(item.modifiedDT || item.modified || item.modified_w3c))
              : now
          });
        }
      }
      // Recursively process children
      if (item.children && item.children.length > 0) {
        pages.push(...extractPages(item.children));
      }
    });
    return pages;
  };

  const cmsPages = extractPages(menuItems);
  cmsPages.forEach(page => {
    urls.push(generateUrlEntry(
      `${SITE_URL}${page.url}`,
      page.lastmod,
      'monthly',
      '0.6'
    ));
  });

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // Write to public directory
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');

  console.log(`✅ Sitemap generated successfully!`);
  console.log(`   Total URLs: ${urls.length}`);
  console.log(`   Output: ${outputPath}`);
}

// Run the generator
generateSitemap().catch(error => {
  console.error('Failed to generate sitemap:', error);
  // Don't exit with error code - allow build to continue
  console.log('⚠️  Sitemap generation had issues but continuing...');
});
