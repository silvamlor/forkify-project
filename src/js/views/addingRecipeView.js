import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddingRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';
  _parentElementIngredients = document.querySelector(
    '.upload__column--ingredients-section'
  );
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnPlus = document.querySelector('.ingredient__btn--plus');
  _btnMinus = document.querySelector('.ingredient__btn--minus');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  // toggleWindow() {
  //   this._overlay.classList.toggle('hidden');
  //   this._window.classList.toggle('hidden');
  // }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.removeHiddenClass.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.addHiddenClass.bind(this));
    this._overlay.addEventListener('click', this.addHiddenClass.bind(this));
  }

  addHiddenClass() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  removeHiddenClass() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  displayCloseBtn(command) {
    if (command === 'hide') {
      this._btnClose.classList.add('hidden');
    }
    if (command === 'show') {
      this._btnClose.classList.remove('hidden');
    }
  }

  _generateMarkup() {
    return `
    <div class="upload__column">
    <h3 class="upload__heading">Recipe data</h3>
    <label>Title</label>
    <input
      value=""
      required
      name="title"
      placeholder="Your recipe's name"
      type="text"
    />
    <label>URL</label>
    <input
      value=""
      required
      name="sourceUrl"
      placeholder="URL to your recipe's source"
      type="text"
    />
    <label>Image URL</label>
    <input
      value=""
      required
      name="image"
      placeholder="URL to your recipe's image"
      type="text"
    />
    <label>Publisher</label>
    <input
      value=""
      required
      name="publisher"
      placeholder="Your recipe's publisher"
      type="text"
    />
    <label>Prep time</label>
    <input
      value=""
      required
      name="cookingTime"
      placeholder="In minutes"
      type="number"
    />
    <label>Servings</label>
    <input
      value=""
      required
      name="servings"
      placeholder="Number of servings"
      type="number"
    />
  </div>

  <div class="upload__column upload__column--ingredients">
  <h3 class="upload__heading">Ingredients</h3>
  <div class="upload__column--ingredients-section">
    <div class="upload__ingredient">
      <div class="upload__label">
        <label>Ingredient 1</label>
      </div>
      <div class="upload__inputs">
        <input
          value=""
          type="text"
          required
          name="ingredient-quantity-1"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          required
          name="ingredient-unit-1"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          required
          name="ingredient-description-1"
          placeholder="Description"
        />
      </div>
    </div>
  </div>
  
  <div class="upload__ingredient-buttons">
    <button class="ingredient__btn ingredient__btn--plus">
      <span>+</span>
    </button>
    <button class="ingredient__btn ingredient__btn--minus">
      <span>-</span>
    </button>
  </div>
</div>

<button class="btn upload__btn">
  <svg>
    <use href="${icons}#icon-upload-cloud"></use>
  </svg>
  <span>Upload</span>
</button>`;
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const plusBtn = document.querySelector('.ingredient__btn--plus');
      const minusBtn = document.querySelector('.ingredient__btn--minus');
      const upload = e.upload;
      if (upload === plusBtn || upload === minusBtn) return;
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  addHandlerAddIngredient(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const plusBtn = document.querySelector('.ingredient__btn--plus');
      const upload = e.upload;
      if (upload !== plusBtn) return;
      handler();
    });
  }

  addHandlerRemoveIngredient(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const minusBtn = document.querySelector('.ingredient__btn--minus');
      const upload = e.upload;
      if (upload !== minusBtn) return;
      handler();
    });
  }

  _generateIngredientHTML() {
    return `          
    <div class="upload__ingredient">
    <div class="upload__label">
      <label>Ingredient ${
        this._parentElementIngredients.childElementCount + 1
      }</label>
    </div>
    <div class="upload__inputs">
        <input
          value=""
          type="text"
          name="ingredient-quantity-${
            this._parentElementIngredients.childElementCount + 1
          }"
          placeholder="Quantity"
        />
        <input
          value=""
          type="text"
          name="ingredient-unit-${
            this._parentElementIngredients.childElementCount + 1
          }"
          placeholder="Unit"
        />
        <input
          value=""
          type="text"
          name="ingredient-description-${
            this._parentElementIngredients.childElementCount + 1
          }"
          placeholder="Description"
        />
    </div>
  </div>`;
  }

  renderIngredient() {
    const HTML = this._generateIngredientHTML();
    this._parentElementIngredients.insertAdjacentHTML('beforeend', HTML);
  }

  removeIngredient() {
    if (this._parentElementIngredients.childElementCount <= 1) return;
    const lastIngredient = this._parentElementIngredients.lastElementChild;
    lastIngredient.remove();
  }

  setParentElementIngredients() {
    this._parentElementIngredients = document.querySelector(
      '.upload__column--ingredients-section'
    );
  }
}
export default new AddingRecipeView();
