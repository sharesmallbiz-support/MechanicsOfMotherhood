import React, { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import RecipeList from '../components/recipes/RecipeList';
import CategoryFilter from '../components/recipes/CategoryFilter';
import SearchBar from '../components/common/SearchBar';

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

  return (
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
  );
};

export default RecipeListPage;
