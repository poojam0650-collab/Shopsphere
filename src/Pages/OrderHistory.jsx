import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './OrderHistory.css';

function OrderHistory() {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('shopSphereOrders') || '[]'
      ).reverse();
    } catch {
      return [];
    }
  });

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status: newStatus }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      'shopSphereOrders',
      JSON.stringify([...updatedOrders].reverse())
    );
  };

  return (
    <>
      <Navbar />

      <main className="order-history-page">
        <header className="order-history-heading">
          <p className="checkout-label">SHOPSPHERE ACCOUNT</p>
          <h1>My Orders</h1>
          <p>View your previous orders and order details.</p>
        </header>

        {orders.length === 0 ? (
          <section className="order-history-empty">
            <h2>No orders yet</h2>
            <p>Your placed orders will appear here.</p>
            <Link to="/shop" className="history-shop-button">
              Start Shopping
            </Link>
          </section>
        ) : (
          <section className="order-history-list">
            {orders.map((order) => {
              const status =
                order.status === 'Order placed'
                  ? 'Processing'
                  : order.status || 'Processing';

              const stages = [
                'Processing',
                'Shipped',
                'Delivered',
              ];

              const currentStage = stages.indexOf(status);

              return (
                <article
                  className="history-order-card"
                  key={order.id}
                >
                  <div className="history-order-top">
                    <div className="history-order-id">
                      <p className="history-muted">Order ID</p>
                      <h2>{order.id}</h2>
                    </div>

                    <div className="history-status-area">
                      <span className="history-status">
                        {status}
                      </span>

                      <label className="status-selector-label">
                        Update order status
                        <select
                          value={status}
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value
                            )
                          }
                        >
                          {stages.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="tracking-progress">
                    {stages.map((stage, index) => (
                      <div
                        className={`tracking-stage ${
                          index <= currentStage ? 'completed' : ''
                        }`}
                        key={stage}
                      >
                        <div className="tracking-dot">
                          {index < currentStage
                            ? '✓'
                            : index + 1}
                        </div>
                        <span>{stage}</span>
                      </div>
                    ))}
                  </div>

                  <div className="history-order-info">
                    <p>
                      <span>Placed on</span>
                      <strong>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Date unavailable'}
                      </strong>
                    </p>

                    <p>
                      <span>Payment method</span>
                      <strong>{order.paymentMethod}</strong>
                    </p>

                    <p>
                      <span>Order total</span>
                      <strong>
                        ₹
                        {Number(order.total || 0).toLocaleString(
                          'en-IN'
                        )}
                      </strong>
                    </p>
                  </div>

                  <div className="history-items">
                    <h3>Items ordered</h3>

                    {Array.isArray(order.items) &&
                      order.items.map((item, index) => (
                        <div
                          className="history-item-row"
                          key={`${order.id}-${item.productId || item.name}-${index}`}
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <strong>
                            ₹
                            {(
                              Number(item.price) *
                              Number(item.quantity)
                            ).toLocaleString('en-IN')}
                          </strong>
                        </div>
                      ))}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <Link to="/shop" className="history-back-link">
          ← Continue Shopping
        </Link>
      </main>
    </>
  );
}

export default OrderHistory;