import AppDispatcher from '../dispatcher/AppDispatcher';

const BookActions = {
  ADD_BOOK: 'ADD_BOOK',

  addBook(book) {
    AppDispatcher.dispatch({
      type: this.ADD_BOOK,
      book
    });
  }
};

export default BookActions;