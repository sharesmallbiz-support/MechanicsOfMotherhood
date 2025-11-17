import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { getMarkdownPreview } from '../../utils/markdown';
import { getUniqueRecipeSlug } from '../../utils/slugify';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Generate SEO-friendly slug from recipe name
    const slug = getUniqueRecipeSlug(recipe);
    navigate(`/recipes/${slug}`);
  };

  // Strip markdown from description for preview
  const descriptionPreview = recipe.description
    ? getMarkdownPreview(recipe.description, 120)
    : null;

  return (
    <Card hoverable onClick={handleClick}>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {recipe.name}
        </h3>

        {descriptionPreview && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {descriptionPreview}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
          {recipe.servings && (
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
              {recipe.servings} servings
            </span>
          )}

          {recipe.authorNM && (
            <span className="italic">By {recipe.authorNM}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
