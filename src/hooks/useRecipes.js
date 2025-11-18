import { useQuery } from '@tanstack/react-query';
import { getRecipes, getRecipeById, getRecipeBySlug } from '../api';
import {
  getStaticRecipeById,
  getStaticRecipeBySlug,
  getStaticRecipesList,
} from '../config/localContent';

const shouldUseStaticRecipes = (params = {}) => {
  const hasFilters = params.categoryId || params.searchTerm;
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 20;
  return !hasFilters && pageNumber === 1 && pageSize >= 10;
};

/**
 * Hook to fetch paginated recipes with optional filtering
 */
export const useRecipes = (params = {}) => {
  const fallbackData = shouldUseStaticRecipes(params) ? getStaticRecipesList() : null;

  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => getRecipes(params),
    initialData: fallbackData ?? undefined,
  });
};

/**
 * Hook to fetch a single recipe by ID
 */
export const useRecipe = (id) => {
  const fallbackData = getStaticRecipeById(id);

  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
    enabled: !!id, // Only run if ID is provided
    initialData: fallbackData ?? undefined,
  });
};

/**
 * Hook to fetch a single recipe by slug (SEO-friendly URL)
 */
export const useRecipeBySlug = (slug) => {
  const fallbackData = getStaticRecipeBySlug(slug);

  return useQuery({
    queryKey: ['recipe', 'slug', slug],
    queryFn: () => getRecipeBySlug(slug),
    enabled: !!slug, // Only run if slug is provided
    initialData: fallbackData ?? undefined,
  });
};
