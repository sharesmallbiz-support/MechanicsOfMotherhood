import { useQuery } from '@tanstack/react-query';
import { getMenuHierarchy } from '../api';
import { getStaticMenuHierarchy } from '../config/localContent';
import useAppStore from '../store/appStore';

/**
 * Hook to fetch and cache menu hierarchy
 */
export const useMenuHierarchy = () => {
  const websiteId = useAppStore((state) => state.websiteId);
  const fallbackData = getStaticMenuHierarchy();

  return useQuery({
    queryKey: ['menuHierarchy', websiteId],
    queryFn: () => getMenuHierarchy(websiteId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!websiteId,
    initialData: fallbackData ?? undefined,
  });
};

export default useMenuHierarchy;
