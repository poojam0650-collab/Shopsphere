import { useState } from 'react';
import Navbar from '../Components/Navbar';
import ProductSection from '../Components/ProductSection';
import API from '../api';
import './Shop.css'

function Shop() {
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState('5000');

  const handleAddToCart = async (product) => {
    try {
      setAdding(true);

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
      setAdding(false);
    }
  };

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist'));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some(
        (item) => String(item.id) === String(product.id)
      );

      const updated = exists
        ? current.filter(
            (item) => String(item.id) !== String(product.id)
          )
        : [...current, product];

      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <Navbar />

      <section className="shop-filters">
  <h1>Find Your Products</h1>

  <div className="shop-filter-controls">
    <div className="shop-filter-field">
      <label htmlFor="product-search">Search products</label>
      <input
        id="product-search"
        type="text"
        placeholder="Try sneakers or watch..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>

    <div className="shop-filter-field">
      <label htmlFor="product-category">Category</label>
      <select
        id="product-category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Fashion">Fashion</option>
        <option value="Accessories">Accessories</option>
        <option value="Electronics">Electronics</option>
      </select>
    </div>

    <div className="shop-filter-field">
      <div className="shop-price-label">
        <label htmlFor="product-price">Maximum price</label>
        <strong>₹{Number(maxPrice).toLocaleString('en-IN')}</strong>
      </div>
      <input
        id="product-price"
        type="range"
        min="0"
        max="5000"
        step="100"
        value={maxPrice}
        onChange={(event) => setMaxPrice(event.target.value)}
      />
    </div>

    <button
      className="shop-clear-button"
      type="button"
      onClick={() => {
        setSearch('');
        setCategory('All');
        setMaxPrice('5000');
      }}
    >
      Clear Filters
    </button>
  </div>
</section>

      <ProductSection
        onAddToCart={handleAddToCart}
        adding={adding}
        wishlist={wishlist}
        ontoggleWishlist={toggleWishlist}
        search={search}
        category={category}
        maxPrice={Number(maxPrice)}
      />
    </>
  );
}

export default Shop;