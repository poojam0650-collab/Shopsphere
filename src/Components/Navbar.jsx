import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('shopSphereCurrentUser') !== null;

  const handleLogout = () => {
    localStorage.removeItem('shopSphereCurrentUser');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🛍️</span>
        ShopSphere
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      <div className="navbar-actions">
        <Link
          to="/wishlist"
          className="nav-icon"
          aria-label="Wishlist"
        >
          ♡
        </Link>

        <Link to="/cart" className="navbar-cart">
          <span aria-hidden="true">🛒</span>
          <span>Cart</span>
        </Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-auth-button">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-auth-link">
              Login
            </Link>
            <Link to="/signup" className="nav-auth-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;