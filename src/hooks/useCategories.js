import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryById } from '../api';
import { getStaticCategories, getStaticCategoryById } from '../config/localContent';

/**
 * Hook to fetch all recipe categories
 */
export const useCategories = (includeInactive = false) => {
  const fallbackData = includeInactive ? null : getStaticCategories();

  return useQuery({
    queryKey: ['categories', includeInactive],
    queryFn: () => getCategories(includeInactive),
    staleTime: 15 * 60 * 1000, // 15 minutes
    initialData: fallbackData ?? undefined,
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id) => {
  const fallbackData = getStaticCategoryById(id);

  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    initialData: fallbackData ?? undefined,
  });
};
