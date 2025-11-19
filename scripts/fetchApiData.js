/**
 * Fetch API Data for Build
 * Fetches fresh data from API and saves to /data folder before build
 */

/* eslint-disable no-console */
/* global process */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE_URL = 'https://webspark.markhazleton.com/api';
const WEBSITE_ID = 2;

/**
 * Fetch data from URL
 */
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Fetch all recipes with pagination
 */
async function fetchAllRecipes() {
  const recipes = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 20) {
    // Safety limit
    const url = `${API_BASE_URL}/recipespark/recipes?pageNumber=${page}&pageSize=100`;
    console.log(`  Fetching recipes page ${page}...`);
    const response = await fetchData(url);

    if (response.success && Array.isArray(response.data)) {
      recipes.push(...response.data);
      // Check pagination metadata
      hasMore = response.pagination && response.pagination.hasNext;
      page++;
    } else {
      hasMore = false;
    }
  }

  return {
    success: true,
    data: recipes,
    message: `Fetched ${recipes.length} recipes`,
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Fetching fresh API data...\n');

  try {
    // Fetch website configuration
    console.log('📡 Fetching website configuration...');
    const websiteConfig = await fetchData(`${API_BASE_URL}/webcms/websites/${WEBSITE_ID}`);
    const websiteConfigPath = join(__dirname, '..', 'data', 'api-website-cache.json');
    writeFileSync(websiteConfigPath, JSON.stringify(websiteConfig, null, 2), 'utf-8');
    console.log(`  ✓ Saved to data/api-website-cache.json\n`);

    // Copy to src/data/website-config.json for local imports
    const srcWebsiteConfigPath = join(__dirname, '..', 'src', 'data', 'website-config.json');
    writeFileSync(srcWebsiteConfigPath, JSON.stringify(websiteConfig, null, 2), 'utf-8');

    // Fetch menu hierarchy
    console.log('📡 Fetching menu hierarchy...');
    const menuHierarchy = await fetchData(
      `${API_BASE_URL}/webcms/websites/${WEBSITE_ID}/menu-hierarchy`
    );
    const menuPath = join(__dirname, '..', 'data', 'api-menu-cache.json');
    writeFileSync(menuPath, JSON.stringify(menuHierarchy, null, 2), 'utf-8');
    console.log(`  ✓ Saved to data/api-menu-cache.json\n`);

    // Copy to src/data/menu-hierarchy.json for local imports
    const srcMenuPath = join(__dirname, '..', 'src', 'data', 'menu-hierarchy.json');
    writeFileSync(srcMenuPath, JSON.stringify(menuHierarchy, null, 2), 'utf-8');

    // Fetch all recipes
    console.log('📡 Fetching recipes...');
    const recipes = await fetchAllRecipes();
    const recipesPath = join(__dirname, '..', 'data', 'api-recipes-cache.json');
    writeFileSync(recipesPath, JSON.stringify(recipes, null, 2), 'utf-8');
    console.log(`  ✓ Saved ${recipes.data.length} recipes to data/api-recipes-cache.json\n`);

    // Copy to src/data/recipes-list.json for local imports
    const srcRecipesPath = join(__dirname, '..', 'src', 'data', 'recipes-list.json');
    writeFileSync(srcRecipesPath, JSON.stringify(recipes, null, 2), 'utf-8');

    console.log('✅ API data fetch complete!');
    console.log(`   Website Config: ${websiteConfig.data?.websiteTitle || 'N/A'}`);
    console.log(`   Menu Items: ${menuHierarchy.data?.length || 0}`);
    console.log(`   Recipes: ${recipes.data.length}`);
  } catch (error) {
    console.error('❌ Error fetching API data:', error.message);
    process.exit(1);
  }
}

main();
