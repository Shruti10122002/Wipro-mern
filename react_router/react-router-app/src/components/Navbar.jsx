import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#007bff", color: "white" }}>
      <h2>Student Dashboard</h2>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
        <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
        <li><Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link></li>
        <li><Link to="/courses" style={{ color: "white", textDecoration: "none" }}>Courses</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
