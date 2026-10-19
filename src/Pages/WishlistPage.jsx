import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Navbar from '../Components/Navbar';
import './WishlistPage.css';

import sneakers from '../assets/sneakers.jpg';
import watch from '../assets/watch.jpg';
import headphones from '../assets/headphones.jpg';
import backpack from '../assets/backpack.jpg';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [addingId, setAddingId] = useState(null);

  const localImages = {
    'Classic Sneakers': sneakers,
    'Minimal Watch': watch,
    'Wireless Headphones': headphones,
    'Everyday Backpack': backpack,
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist'));
      setWishlist(Array.isArray(saved) ? saved : []);
    } catch {
      setWishlist([]);
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(
      (item) => String(item.id) !== String(productId)
    );

    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product.id);

      const response = await API.get('/carts');
      const existingItem = response.data.find(
        (item) => String(item.productId) === String(product.id)
      );

      if (existingItem) {
        await API.put(`/carts/${existingItem.id}`, {
          quantity: Number(existingItem.quantity) + 1,
        });
      } else {
        await API.post('/carts', {
          productId: String(product.id ?? product._id ?? ''),
          name: product.name,
          price: Number(product.price),
          quantity: 1,
        });
      }

      alert('Product added to cart!');
    } catch (error) {
      console.error('Cart API error:', error);
      alert('Unable to add product to cart. Please try again.');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <section className="wishlist-page">
        <p className="section-label">YOUR COLLECTION</p>
        <h1>My Wishlist ♡</h1>
        <p>Your favorite finds, all in one place.</p>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your wishlist is empty</h2>
            <p>Click a heart on any product to save it here.</p>
            <Link to="/">Explore Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <article className="wishlist-card" key={product.id}>
                <div className="wishlist-image">
                  <img
                    src={localImages[product.name]}
                    alt={product.name}
                  />
                </div>

                <h3>{product.name}</h3>
                <p className="wishlist-price">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>

                <button
                  className="wishlist-add-cart"
                  disabled={addingId === product.id}
                  onClick={() => handleAddToCart(product)}
                >
                  {addingId === product.id ? 'Adding...' : '+ Add to Cart'}
                </button>

                <button
                  className="wishlist-remove"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  ♥ Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default WishlistPage;