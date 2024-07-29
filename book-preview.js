class BookPreview extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'book-preview');
  
      const title = document.createElement('h2');
      title.textContent = this.getAttribute('title');
      wrapper.appendChild(title);
  
      const author = document.createElement('p');
      author.textContent = `Author: ${this.getAttribute('author')}`;
      wrapper.appendChild(author);
  
      const description = document.createElement('p');
      description.textContent = this.getAttribute('description');
      wrapper.appendChild(description);
  
      const style = document.createElement('style');
      style.textContent = `
        .book-preview {
          border: 1px solid #ddd;
          padding: 10px;
          margin: 10px;
          border-radius: 5px;
        }
        .book-preview h2 {
          margin: 0;
          font-size: 1.5em;
        }
        .book-preview p {
          margin: 5px 0;
        }
      `;
  
      shadow.appendChild(style);
      shadow.appendChild(wrapper);
    }
  }
  
  customElements.define('book-preview', BookPreview);
  