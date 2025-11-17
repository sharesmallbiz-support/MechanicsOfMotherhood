import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeBySlug, useRecipe } from '../hooks/useRecipes';
import RecipeDetails from '../components/recipes/RecipeDetails';
import Button from '../components/common/Button';
import SEO from '../components/seo/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { generateRecipeSchema } from '../utils/schemaGenerator';
import { stripMarkdown } from '../utils/markdown';

const RecipeDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Check if the parameter is a numeric ID or a slug
  const isNumericId = /^\d+$/.test(slug);

  // Use appropriate hook based on parameter type
  const { data: recipeDataBySlug, isLoading: isLoadingSlug, error: errorSlug } = useRecipeBySlug(
    isNumericId ? null : slug
  );
  const { data: recipeDataById, isLoading: isLoadingId, error: errorId } = useRecipe(
    isNumericId ? slug : null
  );

  // Use the appropriate data source
  const recipeData = isNumericId ? recipeDataById : recipeDataBySlug;
  const isLoading = isNumericId ? isLoadingId : isLoadingSlug;
  const error = isNumericId ? errorId : errorSlug;

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

  // Use slug from recipe data if available for canonical URL, otherwise use URL parameter
  const canonicalSlug = recipe?.slug || slug;

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`/recipes/${canonicalSlug}`}
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
