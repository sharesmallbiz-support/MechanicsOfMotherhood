import { create } from 'zustand';

/**
 * Global app state store using Zustand
 */
const useAppStore = create((set) => ({
  // Website configuration
  websiteConfig: null,
  setWebsiteConfig: (config) => set({ websiteConfig: config }),

  // Menu hierarchy
  menuHierarchy: [],
  setMenuHierarchy: (hierarchy) => set({ menuHierarchy: hierarchy }),

  // Loading states
  isLoadingWebsite: false,
  setIsLoadingWebsite: (loading) => set({ isLoadingWebsite: loading }),

  // Error states
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Website ID for Mechanics of Motherhood
  websiteId: 2,
  setWebsiteId: (id) => set({ websiteId: id }),
}));

export default useAppStore;
