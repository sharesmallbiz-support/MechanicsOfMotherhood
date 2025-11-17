import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import RecipeDetails from '../components/recipes/RecipeDetails';
import Button from '../components/common/Button';
import SEO from '../components/seo/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { generateRecipeSchema } from '../utils/schemaGenerator';
import { stripMarkdown } from '../utils/markdown';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipeData, isLoading, error } = useRecipe(id);

  const recipe = recipeData?.data;

  const handleBack = () => {
    navigate('/recipes');
  };

  // Generate SEO meta tags and schema when recipe data is available
  const seoTitle = recipe?.name || 'Recipe Details';
  const seoDescription = recipe?.description
    ? stripMarkdown(recipe.description).substring(0, 160)
    : 'View this delicious recipe from Mechanics of Motherhood.';
  const seoKeywords = recipe?.tags || ['recipe', 'cooking', 'family meals'];
  const recipeSchema = recipe ? generateRecipeSchema(recipe) : null;

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`/recipes/${id}`}
        type="article"
        keywords={seoKeywords}
        author={recipe?.authorNM}
        image={recipe?.imageUrl}
      />

      {/* Recipe Schema for Rich Results */}
      {recipeSchema && <SchemaMarkup schema={recipeSchema} />}

      <div className="space-y-6">
        {/* Back Button */}
        <Button onClick={handleBack} variant="outline">
          ← Back to Recipes
        </Button>

        {/* Recipe Details */}
        <RecipeDetails recipe={recipe} isLoading={isLoading} error={error} />
      </div>
    </>
  );
};

export default RecipeDetailPage;
