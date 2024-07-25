import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1;
let matches = books;

// dom
const htmlElements = {
  head: document.querySelector("head"),
  header: document.querySelector("header"),

  dataSettingsOverlay: document.querySelector("[data-settings-overlay]"),
  dataSettingsForm: document.querySelector("[data-settings-form]"),
  dataSettingsTheme: document.querySelector("[data-settings-theme]"),
  dataSettingsCancel: document.querySelector("[data-settings-cancel]"),

  dataHeaderSearch: document.querySelector("[data-header-search]"),
  dataHeaderSettings: document.querySelector("[data-header-settings]"),

  dataSearchOverlay: document.querySelector("[data-search-overlay]"),
  dataSearchForm: document.querySelector("[data-search-form]"),
  dataSearchTitle: document.querySelector("[data-search-title]"),
  dataSearchGenres: document.querySelector("[data-search-genres]"),
  dataSearchAuthers: document.querySelector("[data-search-authors]"),
  dataSearchCancel: document.querySelector("[data-search-cancel]"),

  dataListItems: document.querySelector("[data-list-items]"),
  dataListBlur: document.querySelector("[data-list-blur]"),
  dataListImage: document.querySelector("[data-list-image]"),
  dataListTitle: document.querySelector("[data-list-title]"),
  dataListSubtitle: document.querySelector("[data-list-subtitle]"),
  dataListDescription: document.querySelector("[data-list-description]"),
  dataListMessage: document.querySelector("[data-list-message]"),
  dataListButton: document.querySelector("[data-list-button]"),
  dataListActive: document.querySelector("[data-list-active]"),
  dataListClose: document.querySelector("[data-list-close]"),
};

// Calls functions on dom load
document.addEventListener("DOMContentLoaded", () => {
  getMETAHTML();
  addBookPreview();
  setupEventListeners();
});

//Fetches data then adds it to dom
function getMETAHTML() {
  fetch("./meta.html")
    .then((response) => response.text())
    .then((data) => {
      htmlElements.head.innerHTML = data;
    });
}

// Creates book element for html
function createBookElement({ author, id, image, title }) {
  const element = document.createElement("button");
  element.classList.add("preview");
  element.dataset.preview = id;

  element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return element;
}
// Adds book preview to html
function addBookPreview() {
  const starting = document.createDocumentFragment();
  for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = createBookElement(book);
    starting.appendChild(element);
  }
  htmlElements.dataListItems.appendChild(starting);
}