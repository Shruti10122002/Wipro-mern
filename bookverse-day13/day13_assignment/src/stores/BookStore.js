import AppDispatcher from '../dispatcher/AppDispatcher';
import BookActions from '../actions/BookActions';

class BookStore {
  constructor() {
    this.books = [
      { id: 1, title: "1984", author: "George Orwell", price: 299 }
    ];
    this.listeners = [];

    this.dispatchToken = AppDispatcher.register(this.handleAction.bind(this));
  }

  getBooks() {
    return this.books;
  }

  addChangeListener(callback) {
    this.listeners.push(callback);
  }

  removeChangeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  emitChange() {
    this.listeners.forEach(cb => cb());
  }

  handleAction(action) {
    switch (action.type) {
      case BookActions.ADD_BOOK:
        const newBook = {
          id: Date.now(),
          ...action.book
        };
        this.books.push(newBook);
        this.emitChange();
        break;
      default:
        break;
    }
  }
}

export default BookStore;