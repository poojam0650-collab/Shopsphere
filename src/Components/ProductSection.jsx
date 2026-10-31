import { useEffect, useState, useCallback } from 'react';
import API from '../api';
import './ProductSection.css';

import sneakers from '../assets/sneakers.jpg';
import watch from '../assets/watch.jpg';
import headphones from '../assets/headphones.jpg';
import backpack from '../assets/backpack.jpg';
import tshirt from '../assets/cotton tshirt.jpg';

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

// Images available in the local project assets folder.
const imagesByKey = {
sneakers,
watch,
headphones,
backpack,
tshirt
};

// Supports older products that don't have an imageKey saved in MockAPI.
const legacyImages = {
'Classic Sneakers': sneakers,
'Minimal Watch': watch,
'Wireless Headphones': headphones,
'Backpack': backpack,
'Cotton T-shirt': tshirt,
};

// Fetch products from MockAPI.
const fetchProducts = useCallback(async () => {
try {
setError('');

  const response = await API.get('/products');

  if (!Array.isArray(response.data)) {
    throw new Error('Invalid products response');
  }

  setProducts(response.data);
} catch (error) {
  console.error('Error fetching products:', error);
  setError('Unable to load products. Please try again.');
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
fetchProducts();

// Refresh products when returning to this browser tab.
const handleFocus = () => {
  fetchProducts();
};

window.addEventListener('focus', handleFocus);

return () => {
  window.removeEventListener('focus', handleFocus);
};

}, [fetchProducts]);

// Filter products by search, category, and maximum price.
const filteredProducts = products.filter((product) => {
const productName = String(product.name || '');

const matchesSearch = productName
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

  {error && (
    <div>
      <p>{error}</p>
      <button type="button" onClick={fetchProducts}>
        Try Again
      </button>
    </div>
  )}

  {!loading && !error && filteredProducts.length === 0 && (
    <p>
      No products match your filters. Try changing your search or filters.
    </p>
  )}

  {!loading && !error && filteredProducts.length > 0 && (
    <div className="products-grid">
      {filteredProducts.map((product) => {
        const productName = String(product.name || '');

        // Use the selected local image, then legacy mapping, then fallback.
        const productImage =
          imagesByKey[product.imageKey] ||
          legacyImages[productName] ||
          backpack;

        const isWishlisted = wishlist.some(
          (item) => String(item.id) === String(product.id)
        );

        return (
          <article className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={productImage}
                alt={productName}
                className="product-photo"
              />

              <button
                type="button"
                className="product-wishlist"
                aria-label={
                  isWishlisted
                    ? `Remove ${productName} from wishlist`
                    : `Add ${productName} to wishlist`
                }
                onClick={() => ontoggleWishlist(product)}
              >
                {isWishlisted ? '♥' : '♡'}
              </button>
            </div>

            <p className="product-category">{product.category}</p>
            <h3>{productName}</h3>

            <div className="product-bottom">
              <span className="product-price">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>

              <button
                type="button"
                className="add-cart"
                onClick={() => onAddToCart(product)}
                disabled={adding}
              >
                {adding ? 'Adding...' : '+ Add'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  )}
</section>

);
}

export default ProductSection;