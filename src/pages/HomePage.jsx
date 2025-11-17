import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import RecipeList from '../components/recipes/RecipeList';
import useWebsiteConfig from '../hooks/useWebsiteConfig';

const HomePage = () => {
  const { data: websiteData } = useWebsiteConfig();
  const { data: recipesData, isLoading, error } = useRecipes({ pageSize: 6 });

  const websiteConfig = websiteData?.data;
  const recipes = recipesData?.data || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-12 text-white">
        <h1 className="text-5xl font-bold mb-4">
          {websiteConfig?.websiteTitle || 'Mechanics of Motherhood'}
        </h1>
        <p className="text-xl mb-6">
          {websiteConfig?.description || 'Discover delicious recipes and cooking inspiration'}
        </p>
        <Link
          to="/recipes"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          Explore All Recipes
        </Link>
      </div>

      {/* Featured Recipes Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Recipes</h2>
          <Link
            to="/recipes"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </Link>
        </div>
        <RecipeList recipes={recipes} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default HomePage;
