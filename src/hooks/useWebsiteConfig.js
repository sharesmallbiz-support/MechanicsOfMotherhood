import { useQuery } from '@tanstack/react-query';
import { getWebsiteById } from '../api';
import { getStaticWebsiteConfig } from '../config/localContent';
import useAppStore from '../store/appStore';

/**
 * Hook to fetch and cache website configuration
 */
export const useWebsiteConfig = () => {
  const websiteId = useAppStore((state) => state.websiteId);
  const fallbackData = getStaticWebsiteConfig();

  return useQuery({
    queryKey: ['website', websiteId],
    queryFn: () => getWebsiteById(websiteId),
    staleTime: Infinity, // Website config rarely changes
    cacheTime: Infinity,
    enabled: !!websiteId,
    initialData: fallbackData ?? undefined,
  });
};

export default useWebsiteConfig;
