import apiClient from './config';

/**
 * WebCMS API functions for interacting with the WebCMS API
 */

// Websites

/**
 * Get website configuration by ID
 * @param {number} id - Website ID
 * @returns {Promise<Object>} ApiResponse with website configuration
 */
export const getWebsiteById = async (id) => {
  const response = await apiClient.get(`/webcms/websites/${id}`);
  return response.data;
};

// Menus

/**
 * Get paginated list of menu items
 * @param {Object} params - Query parameters
 * @param {number} params.domainId - Filter by domain/website ID
 * @param {boolean} params.displayInNavigation - Filter by navigation display flag
 * @param {number} params.pageNumber - Page number
 * @param {number} params.pageSize - Page size
 * @returns {Promise<Object>} ApiResponse with menu items
 */
export const getMenus = async (params = {}) => {
  const { domainId, displayInNavigation, pageNumber = 1, pageSize = 50 } = params;

  const response = await apiClient.get('/webcms/menus', {
    params: {
      domainId,
      displayInNavigation,
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

/**
 * Get menu hierarchy for a website
 * @param {number} websiteId - Website ID
 * @returns {Promise<Object>} ApiResponse with hierarchical menu structure
 */
export const getMenuHierarchy = async (websiteId) => {
  const response = await apiClient.get(`/webcms/websites/${websiteId}/menu-hierarchy`);
  return response.data;
};

/**
 * Get a single menu item by ID
 * @param {number} id - Menu ID
 * @returns {Promise<Object>} ApiResponse with menu details including pageContent
 */
export const getMenuById = async (id) => {
  const response = await apiClient.get(`/webcms/menus/${id}`);
  return response.data;
};

/**
 * Find a menu item by URL path
 * @param {number} websiteId - Website ID
 * @param {string} url - URL path to match
 * @returns {Promise<Object|null>} Menu item or null if not found
 */
export const findMenuByUrl = async (websiteId, url) => {
  try {
    const response = await getMenus({
      domainId: websiteId,
      pageSize: 100, // Get a large batch to search
    });

    if (response.success && response.data?.items) {
      const menuItem = response.data.items.find((item) => item.url === url);
      if (menuItem) {
        // Get full menu details including pageContent
        return await getMenuById(menuItem.id);
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding menu by URL:', error);
    return null;
  }
};
