import { useFormik } from 'formik';
import * as Yup from 'yup';
import BookActions from '../actions/BookActions';
import { useNavigate } from 'react-router-dom';

const AddBookForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { title: '', author: '', price: '' },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      author: Yup.string().required('Author is required'),
      price: Yup.number().positive('Price must be positive').required('Price is required')
    }),
    onSubmit: (values, { resetForm }) => {
      BookActions.addBook(values);
      resetForm();
      alert('Book added successfully!');
      navigate('/');
    }
  });

  return (
    <div className="form-container">
      <h2>Add New Book</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" {...formik.getFieldProps('title')} />
          {formik.touched.title && formik.errors.title && <div className="error">{formik.errors.title}</div>}
        </div>

        <div className="form-group">
          <label>Author</label>
          <input type="text" {...formik.getFieldProps('author')} />
          {formik.touched.author && formik.errors.author && <div className="error">{formik.errors.author}</div>}
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" {...formik.getFieldProps('price')} />
          {formik.touched.price && formik.errors.price && <div className="error">{formik.errors.price}</div>}
        </div>

        <button type="submit" className="btn">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;