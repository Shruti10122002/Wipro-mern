import { useEffect, useState } from 'react';
import container from '../di/container';

const BookList = () => {
  const [books, setBooks] = useState(container.bookStore.getBooks());

  useEffect(() => {
    const handleChange = () => setBooks([...container.bookStore.getBooks()]);
    container.bookStore.addChangeListener(handleChange);
    return () => container.bookStore.removeChangeListener(handleChange);
  }, []);

  return (
    <div className="book-grid">
      {books.map(book => (
        <div key={book.id} className="book-card">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p className="price">₹{book.price}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;