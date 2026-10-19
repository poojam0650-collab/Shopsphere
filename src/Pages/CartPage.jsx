import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Navbar from '../Components/Navbar';
import './CartPage.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await API.get('/carts');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (item, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await removeItem(item.id);
        return;
      }

      const response = await API.put(`/carts/${item.id}`, {
        quantity: newQuantity,
      });

      setCartItems((items) =>
        items.map((cartItem) =>
          cartItem.id === item.id ? response.data : cartItem
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/carts/${id}`);

      setCartItems((items) =>
        items.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <h1>Your Shopping Cart</h1>

        {loading ? (
          <p>Loading your cart...</p>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>
                      Price: ₹
                      {Number(item.price).toLocaleString('en-IN')}
                    </p>
                    <p>
                      Subtotal: ₹
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item,
                          Number(item.quantity) - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item,
                          Number(item.quantity) + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-total">
              <h2>
                Total: ₹{total.toLocaleString('en-IN')}
              </h2>
              <Link to="/checkout" className="checkout-button">
  Proceed to Checkout →
</Link>
              <Link to="/">Continue Shopping</Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default CartPage;