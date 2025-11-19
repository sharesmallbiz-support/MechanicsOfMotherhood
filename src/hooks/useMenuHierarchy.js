import { getStaticMenuHierarchy } from '../config/localContent';

/**
 * Hook to get menu hierarchy from local data
 * Data is refreshed from API during build process
 */
export const useMenuHierarchy = () => {
  const response = getStaticMenuHierarchy();
  
  return {
    data: response, // Return the full {success, data} structure
    isLoading: false,
    isError: false,
    error: null,
  };
};

export default useMenuHierarchy;
