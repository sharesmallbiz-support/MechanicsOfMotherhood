import { useQuery } from '@tanstack/react-query';
import { getMenuHierarchy } from '../api/webCmsApi';
import useAppStore from '../store/appStore';

/**
 * Hook to fetch and cache menu hierarchy
 */
export const useMenuHierarchy = () => {
  const websiteId = useAppStore((state) => state.websiteId);

  return useQuery({
    queryKey: ['menuHierarchy', websiteId],
    queryFn: () => getMenuHierarchy(websiteId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useMenuHierarchy;
