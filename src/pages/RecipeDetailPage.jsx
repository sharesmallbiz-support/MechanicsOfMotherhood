import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import RecipeDetails from '../components/recipes/RecipeDetails';
import Button from '../components/common/Button';
import SEO from '../components/seo/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { generateRecipeSchema } from '../utils/schemaGenerator';
import { stripMarkdown } from '../utils/markdown';
import { extractIdFromSlug, getUniqueRecipeSlug } from '../utils/slugify';

const RecipeDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Extract recipe ID from slug (e.g., "chocolate-cookies-123" -> 123)
  const recipeId = extractIdFromSlug(slug);

  // Fetch recipe by ID
  const { data: recipeData, isLoading, error } = useRecipe(recipeId);

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

  // Generate canonical slug from recipe data for consistent URLs
  const canonicalSlug = recipe ? getUniqueRecipeSlug(recipe) : slug;

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
