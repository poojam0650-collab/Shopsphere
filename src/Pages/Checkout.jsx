import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import API from '../api';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await API.get('/carts');
        setCartItems(response.data);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Could not load your cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty. Add products before placing an order.');
      return;
    }

    setPlacingOrder(true);

    try {
      const order = {
        ...customer,
        paymentMethod:
          customer.paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : 'Online Payment (Demo)',
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        total,
        status: 'processing',
        createdAt: new Date().toISOString(),
      };

      const savedOrders = JSON.parse(
        localStorage.getItem('shopSphereOrders') || '[]'
      );

      const newOrder = {
        ...order,
        id: `SS-${Date.now()}`,
      };

      localStorage.setItem(
        'shopSphereOrders',
        JSON.stringify([...savedOrders, newOrder])
      );

      sessionStorage.setItem(
        'shopSphereLatestOrder',
        JSON.stringify(newOrder)
      );

      // Clear the MockAPI cart after saving the order.
      const results = await Promise.allSettled(
        cartItems.map((item) => API.delete(`/carts/${item.id}`))
      );

      const failedDeletes = results.some(
        (result) => result.status === 'rejected'
      );

      if (failedDeletes) {
        setError(
          'Your order was saved, but some cart items could not be cleared. Please check your cart.'
        );
        setPlacingOrder(false);
        return;
      }

      navigate('/order-success');
    } catch (err) {
      console.error('Error placing order:', err);
      setError(
        'We could not complete the order. Please try again.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-heading">
          <p className="checkout-label">SHOPSPHERE CHECKOUT</p>
          <h1>Almost yours.</h1>
          <p>Enter your delivery details to place your order.</p>
        </div>

        {loading ? (
          <p>Loading your cart...</p>
        ) : cartItems.length === 0 ? (
          <section className="checkout-card">
            <h2>Your cart is empty</h2>
            <p>Add some products before checking out.</p>
            <Link to="/shop">Continue Shopping</Link>
          </section>
        ) : (
          <div className="checkout-layout">
            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >
              <section className="checkout-card">
                <h2>Delivery details</h2>

                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

                <div className="checkout-two-columns">
                  <div>
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={customer.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={customer.phone}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      title="Enter a 10-digit phone number"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <label htmlFor="address">Delivery address</label>
                <textarea
                  id="address"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  required
                />

                <div className="checkout-two-columns">
                  <div>
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      value={customer.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode">PIN code</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      value={customer.postalCode}
                      onChange={handleChange}
                      pattern="[0-9]{6}"
                      title="Enter a 6-digit PIN code"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="checkout-card">
                <h2>Payment method</h2>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={customer.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives.</small>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={customer.paymentMethod === 'online'}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Online Payment (Demo)</strong>
                    <small>
                      Simulated only. No real payment is processed.
                    </small>
                  </span>
                </label>
              </section>

              {error && (
                <p role="alert" className="checkout-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="checkout-submit"
                disabled={placingOrder}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>

              <Link to="/cart" className="checkout-back">
                ← Return to cart
              </Link>
            </form>

            <aside className="checkout-summary">
              <h2>Order summary</h2>

              {cartItems.map((item) => (
                <div className="checkout-summary-item" key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>
                    ₹
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}

              <div className="checkout-summary-total">
                <strong>Total</strong>
                <strong>₹{total.toLocaleString('en-IN')}</strong>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export default Checkout;