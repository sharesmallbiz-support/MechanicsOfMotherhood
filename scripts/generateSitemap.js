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
/* global process */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE_URL = 'https://webspark.markhazleton.com/api';
const SITE_URL = 'https://mechanicsofmotherhood.com';
const WEBSITE_ID = 2;

/**
 * Fetch all recipes from the API
 */
async function fetchAllRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/Recipe/GetBySiteId/${WEBSITE_ID}`);
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Fetch menu items for dynamic CMS pages
 */
async function fetchMenuItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/WebCms/GetMenuHierarchyByWebsiteId/${WEBSITE_ID}`);
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
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

    // Use slug for SEO-friendly URLs, fallback to id if slug doesn't exist
    const recipeSlug = recipe.slug || recipe.id;

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
      if (item.linkUrl && item.linkUrl !== '/') {
        pages.push({
          url: item.linkUrl,
          lastmod: item.modifiedDT
            ? formatDate(new Date(item.modifiedDT))
            : now
        });
      }
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
  process.exit(1);
});
