import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import Spinner from '../common/Spinner';

const CategoryFilter = ({ selectedCategoryId, onCategoryChange }) => {
  const { data: categoriesData, isLoading } = useCategories();

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          selectedCategoryId === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All Recipes
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            selectedCategoryId === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
