import {
  getStaticRecipeById,
  getStaticRecipeBySlug,
  getStaticRecipesList,
} from '../config/localContent';

/**
 * Hook to get paginated recipes with optional filtering from local data
 * Data is refreshed from API during build process
 */
export const useRecipes = (params = {}) => {
  const allRecipes = getStaticRecipesList();
  
  // Apply filters if provided
  let filteredData = allRecipes?.data || [];
  
  if (params.categoryId) {
    filteredData = filteredData.filter(
      (recipe) => recipe.recipeCategory?.id === Number(params.categoryId)
    );
  }
  
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (recipe) =>
        recipe.title?.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply pagination if pageSize is provided
  if (params.pageSize) {
    filteredData = filteredData.slice(0, params.pageSize);
  }
  
  return {
    data: { success: true, data: filteredData },
    isLoading: false,
    isError: false,
    error: null,
  };
};

/**
 * Hook to get a single recipe by ID from local data
 */
export const useRecipe = (id) => {
  const response = getStaticRecipeById(id);
  
  return {
    data: response, // Return the full {success, data} structure
    isLoading: false,
    isError: !response,
    error: response ? null : new Error('Recipe not found'),
  };
};

/**
 * Hook to get a single recipe by slug from local data
 */
export const useRecipeBySlug = (slug) => {
  const response = getStaticRecipeBySlug(slug);
  
  return {
    data: response, // Return the full {success, data} structure
    isLoading: false,
    isError: !response,
    error: response ? null : new Error('Recipe not found'),
  };
};
