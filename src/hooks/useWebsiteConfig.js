import { getStaticWebsiteConfig } from '../config/localContent';

/**
 * Hook to get website configuration from local data
 * Data is refreshed from API during build process
 */
export const useWebsiteConfig = () => {
  const response = getStaticWebsiteConfig();
  
  return {
    data: response, // Return the full {success, data} structure
    isLoading: false,
    isError: false,
    error: null,
  };
};

export default useWebsiteConfig;
