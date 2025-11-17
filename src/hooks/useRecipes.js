import { useQuery } from '@tanstack/react-query';
import { getRecipes, getRecipeById } from '../api/recipeApi';

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
