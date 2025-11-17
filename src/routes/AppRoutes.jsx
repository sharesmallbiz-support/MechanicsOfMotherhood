import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

      {/* Redirect /recipe to /recipes for CMS menu compatibility */}
      <Route path="/recipe" element={<Navigate to="/recipes" replace />} />

      {/* Generic CMS Page - Catch-all for dynamic pages */}
      <Route path="*" element={<GenericCmsPage />} />
    </Routes>
  );
};

export default AppRoutes;
