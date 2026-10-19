import './Navbar.css';
import {Link} from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <span className="logo-icon">🛍️</span>
        ShopSphere
      </a>

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
      </div>
    </nav>
  );
}

export default Navbar;