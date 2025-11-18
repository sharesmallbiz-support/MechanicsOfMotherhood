import React from 'react';
import Spinner from '../../common/Spinner';
import ErrorMessage from '../../common/ErrorMessage';
import Card from '../../common/Card';
import Markdown from '../../common/Markdown';

const RecipeDetails = ({ recipe, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error?.message || 'Failed to load recipe details. Please try again later.'}
      />
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Recipe not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recipe Header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

        {recipe.description && (
          <div className="text-lg text-gray-600 mb-6">
            <Markdown>{recipe.description}</Markdown>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {recipe.servings && (
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">{recipe.servings} servings</span>
            </div>
          )}

          {recipe.authorNM && (
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">By {recipe.authorNM}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      {recipe.ingredients && (
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
          <Markdown>{recipe.ingredients}</Markdown>
        </Card>
      )}

      {/* Instructions */}
      {recipe.instructions && (
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
          <Markdown>{recipe.instructions}</Markdown>
        </Card>
      )}
    </div>
  );
};

export default RecipeDetails;
