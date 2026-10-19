import { useEffect, useState } from 'react';
import API from '../api';
import './ProductSection.css';
import sneakers from '../assets/sneakers.jpg';
import watch from '../assets/watch.jpg';
import headphones from '../assets/headphones.jpg';
import backpack from '../assets/backpack.jpg';

function ProductSection({
  onAddToCart,
  adding,
  wishlist,
  ontoggleWishlist,
  search = '',
  category = 'All',
  maxPrice = 5000,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const localImages = {
    'Classic Sneakers': sneakers,
    'Minimal Watch': watch,
    'Wireless Headphones': headphones,
    'Everyday Backpack': backpack,
  };

  useEffect(() => {
    API.get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Unable to load products. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      category === 'All' || product.category === category;

    const matchesPrice = Number(product.price) <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section className="products-section" id="products">
      <div className="products-heading">
        <div>
          <p className="section-label">OUR COLLECTION</p>
          <h2>Picked just for you.</h2>
          <p className="products-subtitle">
            Everyday favorites, all in one place.
          </p>
        </div>

        <span className="product-count">
          {filteredProducts.length.toString().padStart(2, '0')} PRODUCTS
        </span>
      </div>

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p>No products match your filters. Try changing your search or filters.</p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img
                  src={localImages[product.name]}
                  alt={product.name}
                  className="product-photo"
                />

                <button
                  className="product-wishlist"
                  aria-label={
                    wishlist.some(
                      (item) => String(item.id) === String(product.id)
                    )
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  onClick={() => ontoggleWishlist(product)}
                >
                  {wishlist.some(
                    (item) => String(item.id) === String(product.id)
                  )
                    ? '♥'
                    : '♡'}
                </button>
              </div>

              <p className="product-category">{product.category}</p>
              <h3>{product.name}</h3>

              <div className="product-bottom">
                <span className="product-price">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>

                <button
                  className="add-cart"
                  onClick={() => onAddToCart(product)}
                  disabled={adding}
                >
                  {adding ? 'Adding...' : '+ Add'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductSection;