import { useQuery } from '@tanstack/react-query';
import { getWebsiteById } from '../api/webCmsApi';
import useAppStore from '../store/appStore';

/**
 * Hook to fetch and cache website configuration
 */
export const useWebsiteConfig = () => {
  const websiteId = useAppStore((state) => state.websiteId);

  return useQuery({
    queryKey: ['website', websiteId],
    queryFn: () => getWebsiteById(websiteId),
    staleTime: Infinity, // Website config rarely changes
    cacheTime: Infinity,
  });
};

export default useWebsiteConfig;
