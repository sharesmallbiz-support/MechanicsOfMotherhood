import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import queryClient from './store/queryClient';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';
import { useWebsiteConfig, useMenuHierarchy } from './hooks';
import Spinner from './components/common/Spinner';
import ErrorMessage from './components/common/ErrorMessage';

/**
 * AppContent - Inner component that uses hooks
 * Must be inside QueryClientProvider to use React Query hooks
 */
const AppContent = () => {
  const { data: _websiteData, isLoading: websiteLoading, error: websiteError } = useWebsiteConfig();
  const { data: _menuData, isLoading: menuLoading, error: menuError } = useMenuHierarchy();

  // Show loading spinner while initial data is loading
  if (websiteLoading || menuLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show error if initial data failed to load
  if (websiteError || menuError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            message={
              websiteError?.message ||
              menuError?.message ||
              'Failed to load application configuration. Please try again later.'
            }
          />
        </div>
      </div>
    );
  }

  // Render the app once initial data is loaded
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

/**
 * Main App component
 * Sets up providers and routing
 */
function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
