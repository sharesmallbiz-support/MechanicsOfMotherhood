import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RecipeListPage from '../pages/RecipeListPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import GenericCmsPage from '../pages/GenericCmsPage';

/**
 * Application routing configuration
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Recipe Routes */}
      <Route path="/recipes" element={<RecipeListPage />} />
      <Route path="/recipes/:slug" element={<RecipeDetailPage />} />

      {/* Generic CMS Page - Catch-all for dynamic pages */}
      <Route path="*" element={<GenericCmsPage />} />
    </Routes>
  );
};

export default AppRoutes;
