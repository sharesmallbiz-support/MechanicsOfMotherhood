# Slug-Based Routing Implementation

## Overview

The Mechanics of Motherhood application now supports SEO-friendly slug-based URLs for recipes. The implementation includes backward compatibility to handle both slugs and numeric IDs.

## How It Works

### URL Format

**With Slug (Preferred):**
```
/recipes/chocolate-chip-cookies
```

**With ID (Fallback):**
```
/recipes/123
```

Both formats work seamlessly, allowing for gradual migration as the API adds slug support to recipes.

## Implementation Details

### 1. RecipeCard Component

The `RecipeCard` component uses a fallback mechanism when navigating:

```javascript
const handleClick = () => {
  // Use slug if available, fallback to id for backward compatibility
  const recipeIdentifier = recipe.slug || recipe.id;
  navigate(`/recipes/${recipeIdentifier}`);
};
```

**Behavior:**
- If `recipe.slug` exists → Navigate to `/recipes/chocolate-chip-cookies`
- If `recipe.slug` is null/undefined → Navigate to `/recipes/123`

### 2. RecipeDetailPage Component

The `RecipeDetailPage` intelligently detects whether the URL parameter is a slug or an ID:

```javascript
// Check if the parameter is a numeric ID or a slug
const isNumericId = /^\d+$/.test(slug);

// Use appropriate hook based on parameter type
const { data: recipeDataBySlug, isLoading: isLoadingSlug, error: errorSlug } =
  useRecipeBySlug(isNumericId ? null : slug);

const { data: recipeDataById, isLoading: isLoadingId, error: errorId } =
  useRecipe(isNumericId ? slug : null);

// Use the appropriate data source
const recipeData = isNumericId ? recipeDataById : recipeDataBySlug;
```

**Behavior:**
- URL: `/recipes/123` → Calls `useRecipe(123)` → API: `GET /recipespark/recipes/123`
- URL: `/recipes/chocolate-chip-cookies` → Calls `useRecipeBySlug('chocolate-chip-cookies')` → API: `GET /recipespark/recipes/slug/chocolate-chip-cookies`

### 3. SEO Canonical URLs

Canonical URLs always prefer slugs when available:

```javascript
// Use slug from recipe data if available for canonical URL, otherwise use URL parameter
const canonicalSlug = recipe?.slug || slug;
```

**Behavior:**
- If recipe has slug → Canonical: `/recipes/chocolate-chip-cookies`
- If recipe has no slug → Canonical: `/recipes/123`

This ensures search engines always index the preferred (slug) URL when available.

## Migration Path

### Current State (No Slugs in API)
1. User clicks recipe card → Navigates to `/recipes/123`
2. Page detects numeric ID → Calls `GET /recipespark/recipes/123`
3. Recipe loads successfully using ID

### Future State (Slugs Added to API)
1. User clicks recipe card → Navigates to `/recipes/chocolate-chip-cookies`
2. Page detects non-numeric slug → Calls `GET /recipespark/recipes/slug/chocolate-chip-cookies`
3. Recipe loads successfully using slug
4. Canonical URL points to slug-based URL for SEO

### Mixed State (Some Recipes Have Slugs)
The application handles mixed scenarios gracefully:
- Old recipes without slugs → Use ID
- New recipes with slugs → Use slug
- No special handling required

## API Endpoints

### Get Recipe by ID (Existing)
```
GET /recipespark/recipes/{id}
```

**Example:**
```
GET /recipespark/recipes/123
```

### Get Recipe by Slug (New)
```
GET /recipespark/recipes/slug/{slug}
```

**Example:**
```
GET /recipespark/recipes/slug/chocolate-chip-cookies
```

## React Query Caching

The implementation uses separate cache keys for ID and slug fetches:

**By ID:**
```javascript
queryKey: ['recipe', id]
```

**By Slug:**
```javascript
queryKey: ['recipe', 'slug', slug]
```

This ensures proper cache invalidation and prevents conflicts.

## Testing

All components include comprehensive tests with both slug and ID scenarios:

```javascript
// Test with slug
const mockRecipe = {
  id: 1,
  slug: 'chocolate-chip-cookies',
  name: 'Chocolate Chip Cookies',
  // ...
};

// Test with ID (no slug)
const recipeWithoutSlug = {
  id: 123,
  name: 'Old Recipe',
  // slug is undefined
};
```

## SEO Benefits

### With Slugs
- **URL:** `/recipes/chocolate-chip-cookies`
- **Benefits:** Keywords in URL, higher CTR, better social sharing
- **Search Engine:** Indexes with rich snippet data

### Without Slugs
- **URL:** `/recipes/123`
- **Benefits:** Still indexed, still crawlable
- **Search Engine:** Indexes but without keyword advantage

## Error Handling

The fallback mechanism prevents common errors:

### Before Fallback
```
Navigate to: /recipes/undefined
API Call: GET /recipespark/recipes/slug/undefined
Result: 405 Method Not Allowed, CORS error
```

### After Fallback
```
Navigate to: /recipes/123
API Call: GET /recipespark/recipes/123
Result: 200 OK, recipe loads successfully
```

## Sitemap Generation

The sitemap generator also uses fallback logic:

```javascript
recipes.forEach(recipe => {
  // Use slug for SEO-friendly URLs, fallback to id if slug doesn't exist
  const recipeSlug = recipe.slug || recipe.id;

  urls.push(generateUrlEntry(
    `${SITE_URL}/recipes/${recipeSlug}`,
    lastmod,
    'weekly',
    '0.8'
  ));
});
```

**Generated Sitemap:**
```xml
<url>
  <loc>https://mechanicsofmotherhood.com/recipes/chocolate-chip-cookies</loc>
  <lastmod>2025-11-17</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://mechanicsofmotherhood.com/recipes/123</loc>
  <lastmod>2025-11-15</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

## Performance Impact

**No Performance Penalty:**
- Single API call per recipe (either by ID or slug)
- React Query caching works as expected
- No additional network requests

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Regular Expressions (`/^\d+$/.test()`)
- React Router v7
- React Query v5

## Recommendations

### For Immediate Use
The current implementation works perfectly with ID-only recipes. No changes needed.

### For Future Enhancement
When the API adds slug support:

1. **Add slug field to Recipe model**
   ```typescript
   interface Recipe {
     id: number;
     slug: string;  // Add this field
     name: string;
     // ... other fields
   }
   ```

2. **Ensure slugs are URL-safe**
   - Use lowercase letters
   - Replace spaces with hyphens
   - Remove special characters
   - Example: "Mom's Best Cookies!" → "moms-best-cookies"

3. **Generate slugs from recipe names**
   ```javascript
   function generateSlug(name) {
     return name
       .toLowerCase()
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/^-+|-+$/g, '');
   }
   ```

4. **Ensure slugs are unique**
   - Check for duplicates in database
   - Append number if needed: "chocolate-cookies-2"

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify API response includes expected fields
3. Test with both numeric IDs and slugs
4. Review network tab in DevTools

All SEO improvements and slug routing have been tested and are working correctly! ✅
