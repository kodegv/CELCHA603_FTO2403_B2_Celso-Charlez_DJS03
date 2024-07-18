// Importing required data from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let currentPage = 1;
let filteredBooks = books

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

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    starting.appendChild(element)
}

document.querySelector('[data-list-items]').appendChild(starting)

const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

document.querySelector('[data-search-genres]').appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

document.querySelector('[data-search-authors]').appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})