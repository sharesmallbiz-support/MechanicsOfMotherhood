import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Spinner from '../components/common/Spinner';

const RecipeListPage = lazy(() => import('../pages/RecipeListPage'));
const RecipeDetailPage = lazy(() => import('../pages/RecipeDetailPage'));
const GenericCmsPage = lazy(() => import('../pages/GenericCmsPage'));

const RouteFallback = () => (
  <div className="flex justify-center items-center min-h-64">
    <Spinner size="xl" />
  </div>
);

/**
 * Application routing configuration
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  );
};

export default AppRoutes;
