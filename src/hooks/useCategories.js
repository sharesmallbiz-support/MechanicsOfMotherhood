import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryById } from '../api/recipeApi';

/**
 * Hook to fetch all recipe categories
 */
export const useCategories = (includeInactive = false) => {
  return useQuery({
    queryKey: ['categories', includeInactive],
    queryFn: () => getCategories(includeInactive),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};
