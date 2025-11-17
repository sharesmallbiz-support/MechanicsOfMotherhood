import { useQuery } from '@tanstack/react-query';
import { getRecipes, getRecipeById, getRecipeBySlug } from '../api/recipeApi';

/**
 * Hook to fetch paginated recipes with optional filtering
 */
export const useRecipes = (params = {}) => {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => getRecipes(params),
  });
};

/**
 * Hook to fetch a single recipe by ID
 */
export const useRecipe = (id) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
    enabled: !!id, // Only run if ID is provided
  });
};

/**
 * Hook to fetch a single recipe by slug (SEO-friendly URL)
 */
export const useRecipeBySlug = (slug) => {
  return useQuery({
    queryKey: ['recipe', 'slug', slug],
    queryFn: () => getRecipeBySlug(slug),
    enabled: !!slug, // Only run if slug is provided
  });
};
