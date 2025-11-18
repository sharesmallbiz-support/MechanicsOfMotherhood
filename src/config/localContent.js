import menuHierarchyJson from '../data/menu-hierarchy.json';
import recipesListJson from '../data/recipes-list.json';
import websiteConfigJson from '../data/website-config.json';

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizedMenuHierarchy = (() => {
  let items = [];

  if (Array.isArray(menuHierarchyJson?.data)) {
    items = menuHierarchyJson.data;
  } else if (Array.isArray(menuHierarchyJson?.data?.items)) {
    items = menuHierarchyJson.data.items;
  }

  return {
    success: menuHierarchyJson?.success ?? true,
    message: menuHierarchyJson?.message ?? '',
    data: items,
  };
})();

const normalizedRecipes = recipesListJson ?? { success: false, data: [] };

const recipeMapById = new Map();
const recipeMapBySlug = new Map();

if (Array.isArray(normalizedRecipes?.data)) {
  normalizedRecipes.data.forEach((recipe) => {
    if (recipe?.id) {
      recipeMapById.set(Number(recipe.id), recipe);
    }

    const slug = recipe?.recipeURL?.split('/')?.filter(Boolean)?.pop();
    if (slug) {
      recipeMapBySlug.set(slug.toLowerCase(), recipe);
    }
  });
}

const normalizedCategories = (() => {
  const map = new Map();

  normalizedRecipes.data?.forEach((recipe) => {
    const category = recipe?.recipeCategory;
    if (category?.id && !map.has(category.id)) {
      map.set(category.id, {
        id: category.id,
        name: category.name,
        description: category.description,
        order: category.order,
        isActive: category.isActive,
        url: category.url,
        domainID: category.domainID,
      });
    }
  });

  return {
    success: true,
    data: Array.from(map.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };
})();

export const getStaticWebsiteConfig = () =>
  websiteConfigJson ? clone(websiteConfigJson) : null;

export const getStaticMenuHierarchy = () => clone(normalizedMenuHierarchy);

export const getStaticRecipesList = () => clone(normalizedRecipes);

export const getStaticRecipeById = (id) => {
  if (!id) return null;
  const recipe = recipeMapById.get(Number(id));
  return recipe ? clone({ success: true, data: recipe }) : null;
};

export const getStaticRecipeBySlug = (slug) => {
  if (!slug) return null;
  const recipe = recipeMapBySlug.get(String(slug).toLowerCase());
  return recipe ? clone({ success: true, data: recipe }) : null;
};

export const getStaticCategories = () => clone(normalizedCategories);

export const getStaticCategoryById = (id) => {
  if (!id) return null;
  const category = normalizedCategories.data.find((cat) => cat.id === Number(id));
  return category ? clone({ success: true, data: category }) : null;
};