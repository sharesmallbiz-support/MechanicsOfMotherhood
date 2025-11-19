# API Cache Directory

This directory contains cached API responses used by the sitemap generator.

## Files

- `api-recipes-cache.json` - Cached recipe data from the RecipeSpark API
- `api-menu-cache.json` - Cached menu hierarchy from the WebCMS API

## Purpose

The sitemap generator (`scripts/generateSitemap.js`) caches API responses here to:

1. **Improve Performance** - Avoid re-fetching data on every build
2. **Offline Support** - Allow sitemap generation when API is temporarily unavailable
3. **Reduce API Load** - Minimize API calls during development

## Cache Strategy

1. **First Run**: Fetches fresh data from API and saves to cache
2. **Subsequent Runs**: Uses API if available, otherwise uses cache
3. **Fallback**: If both API and cache fail, uses `/src/data/*.json` fallback files

## Maintenance

The cache files are automatically updated when:
- `npm run generate-sitemap` is executed
- `npm run build` is executed (which runs sitemap generation)

The cache files include a `cachedAt` timestamp showing when they were last updated.

## Git Ignore

Cache files are git-ignored (`.gitignore` pattern: `data/api-*.json`) to:
- Avoid repository bloat with large JSON files
- Prevent merge conflicts from frequently changing cache
- Allow each environment to maintain its own cache

## Manual Cache Refresh

To force a fresh API fetch and update cache:

```bash
# Simply run the sitemap generator
npm run generate-sitemap

# Or run a full build
npm run build
```

The cache will be automatically updated if the API is accessible.
