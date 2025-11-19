import React, { useState } from 'react';
import { useRecipes } from '../hooks';
import RecipeList from '../components/recipes/RecipeList';
import CategoryFilter from '../components/recipes/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SEO from '../components/seo/SEO';

const RecipeListPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: recipesData, isLoading, error } = useRecipes({
    categoryId: selectedCategoryId,
    searchTerm: searchTerm || undefined,
    pageNumber: currentPage,
    pageSize: 12,
  });

  const recipes = recipesData?.data || [];
  const pagination = recipesData?.pagination;

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleNextPage = () => {
    if (pagination?.hasNext) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPrevious) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate dynamic SEO based on search and filters
  const generateSEOTitle = () => {
    if (searchTerm) {
      return `Recipes matching "${searchTerm}"`;
    }
    if (currentPage > 1) {
      return `All Recipes - Page ${currentPage}`;
    }
    return 'All Recipes';
  };

  const generateSEODescription = () => {
    if (searchTerm) {
      return `Search results for "${searchTerm}". Discover delicious recipes from Mechanics of Motherhood.`;
    }
    return 'Browse our complete collection of delicious family recipes. Find easy, wholesome meals the whole family will love.';
  };

  const generateCanonicalUrl = () => {
    return '/recipes';
  };

  const seoTitle = generateSEOTitle();
  const seoDescription = generateSEODescription();
  const canonicalUrl = generateCanonicalUrl();

  // Use noindex for paginated pages and search results to avoid duplicate content
  const shouldNoIndex = currentPage > 1 || searchTerm !== '';

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalUrl}
        keywords={['recipes', 'cooking', 'family meals', 'easy recipes', 'home cooking']}
        noindex={shouldNoIndex}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: 'Recipes', path: '/recipes' }]} />

      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Recipes</h1>
          <p className="text-lg text-gray-600">
            Browse our collection of delicious recipes
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search recipes by name, description, or ingredients..."
        />

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Category</h3>
          <CategoryFilter
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Recipe List */}
        <RecipeList recipes={recipes} isLoading={isLoading} error={error} />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-6">
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrevious}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeListPage;
