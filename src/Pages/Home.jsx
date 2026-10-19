import { useState, useEffect } from 'react';
import API from '../api';
import Hero from '../Components/Hero';
import Navbar from '../Components/Navbar';
import ProductSection from '../Components/ProductSection';

function Home() {
  const [adding, setAdding] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}, [wishlist]);
const toggleWishlist = (product) => {
  setWishlist((currentWishlist) => {
    const alreadySaved = currentWishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    if (alreadySaved) {
      return currentWishlist.filter(
        (item) => String(item.id) !== String(product.id)
      );
    }

    return [...currentWishlist, product];
  });
};

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
          productId: String(product.id ?? product._id??''),
          name: product.name,
          price: Number(product.price),
          quantity: 1,
        });
      }

      console.log('Product added to cart!');
    } catch (error) {
  console.error('Cart API error:', error.response?.status);
  console.error('Error details:', error.response?.data);
  console.error('Request URL:', error.config?.url);
  alert(
    `Cart error: ${error.response?.status || error.message}`
  );
} finally {
  setAdding(false);
}
  };

  return (
    <>
      <div className="announcement">
        ✨ Discover your everyday favorites at ShopSphere
      </div>

      <Navbar />
      <Hero />
      <ProductSection onAddToCart={handleAddToCart} adding={adding} wishlist={wishlist} ontoggleWishlist={toggleWishlist}/>
    </>
  );
}

export default Home;