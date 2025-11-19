import { getStaticCategories, getStaticCategoryById } from '../config/localContent';

/**
 * Hook to get all recipe categories from local data
 * Data is refreshed from API during build process
 */
export const useCategories = (includeInactive = false) => {
  const data = getStaticCategories();
  
  // Filter out inactive if requested
  const filteredData = includeInactive
    ? data?.data
    : data?.data?.filter((cat) => cat.isActive !== false);
  
  return {
    data: { success: true, data: filteredData },
    isLoading: false,
    isError: false,
    error: null,
  };
};

/**
 * Hook to get a single category by ID from local data
 */
export const useCategory = (id) => {
  const data = getStaticCategoryById(id);
  
  return {
    data: data?.data,
    isLoading: false,
    isError: !data,
    error: data ? null : new Error('Category not found'),
  };
};
