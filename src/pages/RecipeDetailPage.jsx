import React, { Suspense, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks';
import RecipeDetails from '../components/recipes/details/RecipeDetails';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import SEO from '../components/seo/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { generateRecipeSchema } from '../utils/schemaGenerator';
import { stripMarkdown } from '../utils/markdown';
import { extractIdFromSlug, getUniqueRecipeSlug } from '../utils/slugify';

const PrintableRecipe = React.lazy(() => import('../components/recipes/details/PrintableRecipe'));

const RecipeDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showPrintView, setShowPrintView] = useState(false);

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
        {/* Back Button and Print Toggle */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleBack} variant="outline">
            ← Back to Recipes
          </Button>

          {recipe && !isLoading && !error && (
            <Button
              onClick={() => setShowPrintView(!showPrintView)}
              variant={showPrintView ? 'primary' : 'outline'}
            >
              {showPrintView ? '← View Recipe' : '🖨️ Print Recipe'}
            </Button>
          )}
        </div>

        {/* Show either print view or regular view */}
        {showPrintView ? (
          <Suspense
            fallback={(
              <div className="flex justify-center items-center min-h-64">
                <Spinner size="xl" />
              </div>
            )}
          >
            <PrintableRecipe recipe={recipe} />
          </Suspense>
        ) : (
          <RecipeDetails recipe={recipe} isLoading={isLoading} error={error} />
        )}
      </div>
    </>
  );
};

export default RecipeDetailPage;
