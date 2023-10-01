const templates = {
  book: document.querySelector('#template-book').innerHTML,
};

const select = {
  booksList: '.books-list',
  book: {
    image: '.book__image',
    ratingFill: '.book__rating__fill',
  },
  filters: '.filters',
  checkboxes: 'input[type=\'checkbox\']',
};

const classNames = {
  book: 'book',
  hidden: 'hidden',
};

const settings = {
  ratingThresholds: [
    { rate: 0, color: '#fefcea 0%, #f1da36 100%' },
    { rate: 6, color: '#b4df5b 0%,#b4df5b 100%' },
    { rate: 8, color: '#299a0b 0%, #299a0b 100%' },
    { rate: 9, color: '#ff0084 0%,#ff0084 100%' },
  ],
};

const attributes = {
  book: {
    id: 'data-id',
  },
};

class BooksList {
  constructor() {
    this.booksList = [];
    this.favoriteBooks = [];

    this.getElements();

    dataSource.books.map((book) => {
      const htmlRenderer = Handlebars.compile(templates.book);
      const bookHTML = htmlRenderer(book);
      const bookBody = utils.createDOMFromHTML(bookHTML);
      const bookObj = new Book(bookBody, book);
      this.addBook(bookObj);
    });

    this.initActions();
  }

  getElements() {
    this.dom = {};
    this.dom.wrapper = document.querySelector(select.booksList);
    this.dom.filters = document.querySelector(select.filters);
  }

  initActions() {
    this.dom.wrapper.addEventListener('dblclick', (e) => {
      const bookElement = e.target.findElementWithClass(select.book.image);
      if (bookElement) {
        const id = bookElement.getAttribute(attributes.book.id);
        const book = this.booksList.find((book) => book.id == id);
        if (book) {
          book.like();
        }
      }
    });

    this.dom.wrapper.addEventListener('like', (e) => {
      const { id, isLiked } = e.detail;
      if (isLiked) {
        const book = this.booksList.find((book) => book.id === id);
        this.favoriteBooks.push(book);
      } else {
        this.favoriteBooks = this.favoriteBooks.filter(
          (book) => book.id !== id
        );
      }
    });

    this.dom.filters.addEventListener('click', () => {
      const checked = [
        ...this.dom.filters.querySelectorAll(select.checkboxes),
      ].filter((box) => box.checked);
      if (checked.length > 0) {
        const filters = checked.map((box) => box.value);
        this.booksList.map((book) => {
          book.show();
          filters.map((filter) => {
            if (book.details[filter] === true) {
              book.hide();
            }
          });
        });
      } else {
        this.booksList.map((book) => book.show());
      }
    });
  }

  addBook(book) {
    this.booksList.push(book);
    this.dom.wrapper.append(book.dom.wrapper);
  }
}

class Book {
  constructor(element, bookData) {
    Object.assign(this, bookData);
    this.dom = { wrapper: element };
    this.getElements();
    this.getRatingFill();
  }

  getElements() {
    this.dom.bookImage = this.dom.wrapper.querySelector(select.book.image);
    this.dom.bookRatingFill = this.dom.wrapper.querySelector(
      select.book.ratingFill
    );
  }

  getRatingFill() {
    const { color } = settings.ratingThresholds.reduce((prev, current) => {
      if (this.rating > current.rate) {
        prev = current;
      }
      return prev;
    }, settings.ratingThresholds[0]);

    this.dom.bookRatingFill.style.width = `${(this.rating / 10) * 100}%`;
    this.dom.bookRatingFill.style.background = `linear-gradient(to bottom, ${color})`;
  }

  like() {
    this.isLiked = !this.isLiked;
    this.isLiked
      ? this.dom.bookImage.classList.add('favorite')
      : this.dom.bookImage.classList.remove('favorite');
    const event = new CustomEvent('like', {
      detail: {
        id: this.id,
        isLiked: this.isLiked,
      },
      bubbles: true,
    });
    this.dom.wrapper.dispatchEvent(event);
  }

  show() {
    this.dom.bookImage.classList.remove(classNames.hidden);
  }

  hide() {
    this.dom.bookImage.classList.add(classNames.hidden);
  }
}

// eslint-disable-next-line no-unused-vars
const app = new BooksList();
