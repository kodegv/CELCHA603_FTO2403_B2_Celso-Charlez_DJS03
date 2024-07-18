// Importing required data from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let currentPage = 1;
let filteredBooks = books;

// HTML Elements Object
const elements = {
  head: document.querySelector("head"),
  header: document.querySelector("header"),

  settingsOverlay: document.querySelector("[data-settings-overlay]"),
  settingsForm: document.querySelector("[data-settings-form]"),
  settingsTheme: document.querySelector("[data-settings-theme]"),
  settingsCancel: document.querySelector("[data-settings-cancel]"),

  headerSearch: document.querySelector("[data-header-search]"),
  headerSettings: document.querySelector("[data-header-settings]"),

  searchOverlay: document.querySelector("[data-search-overlay]"),
  searchForm: document.querySelector("[data-search-form]"),
  searchTitle: document.querySelector("[data-search-title]"),
  searchGenres: document.querySelector("[data-search-genres]"),
  searchAuthors: document.querySelector("[data-search-authors]"),
  searchCancel: document.querySelector("[data-search-cancel]"),

  listItems: document.querySelector("[data-list-items]"),
  listBlur: document.querySelector("[data-list-blur]"),
  listImage: document.querySelector("[data-list-image]"),
  listTitle: document.querySelector("[data-list-title]"),
  listSubtitle: document.querySelector("[data-list-subtitle]"),
  listDescription: document.querySelector("[data-list-description]"),
  listMessage: document.querySelector("[data-list-message]"),
  listButton: document.querySelector("[data-list-button]"),
  listActive: document.querySelector("[data-list-active]"),
  listClose: document.querySelector("[data-list-close]"),
};

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  loadMetaHTML();
  displayBookPreviews();
  addEventListeners();
});

// Function to fetch and set meta HTML
function loadMetaHTML() {
  fetch("./meta.html")
    .then((response) => response.text())
    .then((data) => {
      elements.head.innerHTML = data;
    });
}

// Function to create a book element
function createBookElement({ author, id, image, title }) {
  const button = document.createElement("button");
  button.classList.add("preview");
  button.dataset.preview = id;

  button.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return button;
}

// Function to display book previews
function displayBookPreviews() {
  const fragment = document.createDocumentFragment();
  for (const book of filteredBooks.slice(0, BOOKS_PER_PAGE)) {
    const bookElement = createBookElement(book);
    fragment.appendChild(bookElement);
  }
  elements.listItems.appendChild(fragment);
}

// Function to create an option element
function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.innerText = text;
  return option;
}

// Function to populate select elements with options
function populateSelect(element, options, defaultText) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createOption("any", defaultText));
  for (const [value, text] of Object.entries(options)) {
    fragment.appendChild(createOption(value, text));
  }
  element.appendChild(fragment);
}

// Populate genres and authors select elements
populateSelect(elements.searchGenres, genres, "All Genres");
populateSelect(elements.searchAuthors, authors, "All Authors");

// Update the "Show more" button
const remainingBooks = filteredBooks.length - currentPage * BOOKS_PER_PAGE;
elements.listButton.innerHTML = `
  <span>Show more</span>
  <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
`;
elements.listButton.disabled = remainingBooks <= 0;

// Function to add event listeners
function addEventListeners() {
  elements.searchCancel.addEventListener("click", () => {
    elements.searchOverlay.open = false;
  });

  elements.settingsCancel.addEventListener("click", () => {
    elements.settingsOverlay.open = false;
  });

  elements.headerSearch.addEventListener("click", () => {
    elements.searchOverlay.open = true;
    elements.searchTitle.focus();
  });

  elements.headerSettings.addEventListener("click", () => {
    elements.settingsOverlay.open = true;
  });

  elements.listClose.addEventListener("click", () => {
    elements.listActive.open = false;
  });

  // Event listener for search form submission
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    filteredBooks = books.filter((book) => {
      const matchesTitle = filters.title.trim() === "" || book.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchesAuthor = filters.author === "any" || book.author === filters.author;
      const matchesGenre = filters.genre === "any" || book.genres.includes(filters.genre);
      return matchesTitle && matchesAuthor && matchesGenre;
    });

    currentPage = 1;
    updateBookList(filteredBooks);

    window.scrollTo({ top: 0, behavior: "smooth" });
    elements.searchOverlay.open = false;
  });

  // Event listener for "Show more" button
  elements.listButton.addEventListener("click", () => {
    const fragment = document.createDocumentFragment();
    for (const book of filteredBooks.slice(currentPage * BOOKS_PER_PAGE, (currentPage + 1) * BOOKS_PER_PAGE)) {
      const bookElement = createBookElement(book);
      fragment.appendChild(bookElement);
    }
    elements.listItems.appendChild(fragment);
    currentPage += 1;

    elements.listButton.disabled = filteredBooks.length <= currentPage * BOOKS_PER_PAGE;
    elements.listButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${Math.max(filteredBooks.length - currentPage * BOOKS_PER_PAGE, 0)})</span>
    `;
  });

  // Event listener for displaying book details
  elements.listItems.addEventListener("click", (event) => {
    const previewId = event.target.closest(".preview")?.dataset.preview;
    if (!previewId) return;

    const activeBook = books.find((book) => book.id === previewId);
    if (activeBook) {
      elements.listActive.open = true;
      elements.listBlur.src = activeBook.image;
      elements.listImage.src = activeBook.image;
      elements.listTitle.innerText = activeBook.title;
      elements.listSubtitle.innerText = `${authors[activeBook.author]} (${new Date(activeBook.published).getFullYear()})`;
      elements.listDescription.innerText = activeBook.description;
    }
  });
}

// Check user's color scheme preference
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  applyTheme("night");
} else {
  applyTheme("day");
}

// Event listener for settings form submission
elements.settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  applyTheme(theme);

  elements.settingsOverlay.open = false;
});

// Function to switch between light and dark themes
function applyTheme(theme) {
  document.documentElement.style.setProperty("--color-dark", theme === "night" ? "255, 255, 255" : "10, 10, 20");
  document.documentElement.style.setProperty("--color-light", theme === "night" ? "10, 10, 20" : "255, 255, 255");
}

// Function to update book list
function updateBookList(result) {
  const fragment = document.createDocumentFragment();
  for (const book of result.slice(0, BOOKS_PER_PAGE)) {
    const bookElement = createBookElement(book);
    fragment.appendChild(bookElement);
  }
  elements.listItems.innerHTML = "";
  elements.listItems.appendChild(fragment);

  elements.listButton.disabled = result.length <= BOOKS_PER_PAGE;
  elements.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(result.length - BOOKS_PER_PAGE, 0)})</span>
  `;

  elements.listMessage.classList.toggle("list__message_show", result.length === 0);
}
