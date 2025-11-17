import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import RecipeDetails from '../components/recipes/RecipeDetails';
import Button from '../components/common/Button';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipeData, isLoading, error } = useRecipe(id);

  const recipe = recipeData?.data;

  const handleBack = () => {
    navigate('/recipes');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button onClick={handleBack} variant="outline">
        ← Back to Recipes
      </Button>

      {/* Recipe Details */}
      <RecipeDetails recipe={recipe} isLoading={isLoading} error={error} />
    </div>
  );
};

export default RecipeDetailPage;
