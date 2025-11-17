import apiClient from './config';

/**
 * Recipe API functions for interacting with the RecipeSpark API
 */

// Recipes

/**
 * Get a paginated list of recipes with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.categoryId - Filter by category ID
 * @param {string} params.searchTerm - Search term
 * @param {number} params.pageNumber - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} ApiResponse with recipe data
 */
export const getRecipes = async (params = {}) => {
  const { categoryId, searchTerm, pageNumber = 1, pageSize = 20 } = params;

  const response = await apiClient.get('/recipespark/recipes', {
    params: {
      categoryId,
      searchTerm,
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

/**
 * Get a single recipe by ID
 * @param {number} id - Recipe ID
 * @returns {Promise<Object>} ApiResponse with recipe data
 */
export const getRecipeById = async (id) => {
  const response = await apiClient.get(`/recipespark/recipes/${id}`);
  return response.data;
};

/**
 * Create a new recipe
 * @param {Object} recipe - Recipe data
 * @returns {Promise<Object>} ApiResponse with created recipe
 */
export const createRecipe = async (recipe) => {
  const response = await apiClient.post('/recipespark/recipes', recipe);
  return response.data;
};

/**
 * Update an existing recipe
 * @param {number} id - Recipe ID
 * @param {Object} recipe - Updated recipe data
 * @returns {Promise<Object>} ApiResponse with updated recipe
 */
export const updateRecipe = async (id, recipe) => {
  const response = await apiClient.put(`/recipespark/recipes/${id}`, recipe);
  return response.data;
};

/**
 * Delete a recipe
 * @param {number} id - Recipe ID
 * @returns {Promise<Object>} ApiResponse with deletion confirmation
 */
export const deleteRecipe = async (id) => {
  const response = await apiClient.delete(`/recipespark/recipes/${id}`);
  return response.data;
};

// Categories

/**
 * Get all recipe categories
 * @param {boolean} includeInactive - Include inactive categories
 * @returns {Promise<Object>} ApiResponse with categories
 */
export const getCategories = async (includeInactive = false) => {
  const response = await apiClient.get('/recipespark/categories', {
    params: { includeInactive },
  });
  return response.data;
};

/**
 * Get a single category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} ApiResponse with category data
 */
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/recipespark/categories/${id}`);
  return response.data;
};
