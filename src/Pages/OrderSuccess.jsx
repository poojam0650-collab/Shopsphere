import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './OrderSuccess.css';

function OrderSuccess() {
  let order = null;

  try {
    order = JSON.parse(
      sessionStorage.getItem('shopSphereLatestOrder') || 'null'
    );
  } catch {
    order = null;
  }

  return (
    <>
      <Navbar />

      <main className="order-success-page">
        <section className="order-success-card">
          <div className="success-check">✓</div>

          <p className="checkout-label">SHOPSPHERE</p>
          <h1>Thank you for your order!</h1>
          <p>
            {order
              ? 'Your order has been placed successfully.'
              : 'Your order confirmation is not available in this browser session.'}
          </p>

          {order && (
            <div className="success-order-details">
              <p>
                <span>Order ID</span>
                <strong>{order.id}</strong>
              </p>
              <p>
                <span>Name</span>
                <strong>{order.name}</strong>
              </p>
              <p>
                <span>Payment</span>
                <strong>{order.paymentMethod}</strong>
              </p>
              <p>
                <span>Order total</span>
                <strong>
                  ₹{Number(order.total).toLocaleString('en-IN')}
                </strong>
              </p>
            </div>
          )}

          <Link to="/shop" className="success-home-button">
            Continue Shopping
          </Link>
        </section>
      </main>
    </>
  );
}

export default OrderSuccess;