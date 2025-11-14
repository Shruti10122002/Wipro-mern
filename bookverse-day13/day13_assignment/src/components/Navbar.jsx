import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1>BookVerse</h1>
        <div>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>
            Add Book
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;