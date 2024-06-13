import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
// import addRecipeView from './views/addRecipeView.js';
import addingRecipeView from './views/addingRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);
    const importedRecipe = model.state.recipe;

    // Rendering recipe
    recipeView.render(importedRecipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // Load search results
    await model.loadSearchResults(`${query}`);
    // Render results
    resultsView.render(model.getSearchResultsPage());
    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    throw error;
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Update the view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Loading spinner
    addingRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success msg
    addingRecipeView.renderMessage();

    addingRecipeView.displayCloseBtn('hide');
    setTimeout(() => {
      addingRecipeView.addHiddenClass();
      addingRecipeView.render(model.state.recipe);
      addingRecipeView.setParentElementIngredients();
      addingRecipeView.displayCloseBtn('show');
    }, MODAL_CLOSE_SEC * 1000);
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addingRecipeView.renderError(err.message);
    addingRecipeView.displayCloseBtn('hide');
    setTimeout(() => {
      addingRecipeView.addHiddenClass();
      addingRecipeView.render(model.state.recipe);
      addingRecipeView.setParentElementIngredients();
      addingRecipeView.displayCloseBtn('show');

      addingRecipeView.addHandlerAddIngredient(controlAddIngredient);
      addingRecipeView.addHandlerRemoveIngredient(controlRemoveIngredient);
    }, MODAL_CLOSE_SEC * 1000);
  }
};

const controlAddIngredient = function () {
  addingRecipeView.renderIngredient();
};

const controlRemoveIngredient = function () {
  addingRecipeView.removeIngredient();
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addingRecipeView.addHandlerUpload(controlAddRecipe);
  addingRecipeView.addHandlerAddIngredient(controlAddIngredient);
  addingRecipeView.addHandlerRemoveIngredient(controlRemoveIngredient);
};
init();
