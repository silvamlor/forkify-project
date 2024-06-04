import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import indexOf from 'core-js/es/array/';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    const recipeData = data.data.recipe;
    state.recipe = createRecipeObject(recipeData, recipeData.ingredients);

    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const sData = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = sData.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image_url: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  // const end = page * state.search.resultsPerPage;
  const end =
    (page - 1) * state.search.resultsPerPage + state.search.resultsPerPage;
  state.search.page = page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
};

export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

export const loadBookmarks = function () {
  if (!localStorage.getItem('bookmarks')) return;
  const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  state.bookmarks = storedBookmarks;
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const addQuantity = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('quantity') && entry[1] !== '')
      .map(entry => entry[1]);

    const addUnits = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('unit') && entry[1] !== '')
      .map(entry => entry[1]);

    const addDescription = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('description') && entry[1] !== '')
      .map(entry => entry[1]);

    const addIng = addQuantity
      .map(quantity => {
        const index = addQuantity.indexOf(quantity);
        const ingredient = [quantity, addUnits[index], addDescription[index]];
        return ingredient;
      })
      .map(ingArr => {
        return { quantity: ingArr[0], unit: ingArr[1], description: ingArr[2] };
      });

    const addingRecipe = createRecipeObject(newRecipe, addIng);
    const uploadRecipe = await AJAX(`${API_URL}?key=${KEY}`, addingRecipe);
    state.recipe = createRecipeObject(
      uploadRecipe.data.recipe,
      uploadRecipe.data.recipe.ingredients
    );
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const createRecipeObject = function (data, ingArr) {
  const formatedObject = {
    ...data,
    title: data.title,
    source_url: data.sourceUrl || data.source_url,
    image_url: data.image || data.image_url,
    publisher: data.publisher,
    cooking_time: +data.cooking_time,
    servings: +data.servings,
    ingredients: ingArr,
    id: data.id,
  };
  return formatedObject;
};
