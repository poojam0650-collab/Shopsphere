import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminOrders.css';

const STORAGE_KEY = 'shopSphereOrders';

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered'];

function readOrders() {
  try {
    const savedOrders = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    return Array.isArray(savedOrders) ? savedOrders : [];
  } catch {
    return [];
  }
}

function formatDate(date) {
  if (!date) return 'Date unavailable';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

function AdminOrders() {
  const [orders, setOrders] = useState(readOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const syncOrders = () => setOrders(readOrders());

    // Refresh if orders change in another tab.
    window.addEventListener('storage', syncOrders);

    return () => {
      window.removeEventListener('storage', syncOrders);
    };
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status: newStatus }
        : order
    );

    setOrders(updatedOrders);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedOrders)
    );
  };

  const getStatus = (order) => {
    if (!order.status || order.status === 'Order placed') {
      return 'Processing';
    }

    return order.status;
  };

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const processingCount = orders.filter(
    (order) => getStatus(order) === 'Processing'
  ).length;

  const shippedCount = orders.filter(
    (order) => getStatus(order) === 'Shipped'
  ).length;

  const deliveredCount = orders.filter(
    (order) => getStatus(order) === 'Delivered'
  ).length;

  const filteredOrders = [...orders]
    .reverse()
    .filter((order) => {
      const orderId = String(order.id || '').toLowerCase();
      const matchesSearch = orderId.includes(
        search.trim().toLowerCase()
      );

      const matchesStatus =
        statusFilter === 'All' ||
        getStatus(order) === statusFilter;

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="admin-orders-page">
      <aside className="admin-orders-sidebar">
        <h2>ShopSphere</h2>
        <p className="admin-orders-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders" className="active">
            Orders
          </Link>
          <Link to="/admin/customers">Customers</Link>
        </nav>
      </aside>

      <main className="admin-orders-main">
        <header className="admin-orders-header">
          <div>
            <p className="admin-orders-eyebrow">SHOPSPHERE MANAGEMENT</p>
            <h1>Orders</h1>
            <p>Review orders and keep their status up to date.</p>
          </div>

          <Link to="/admin" className="admin-orders-back">
            ← Dashboard
          </Link>
        </header>

        <section className="admin-orders-stats">
          <article className="admin-orders-stat">
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </article>

          <article className="admin-orders-stat">
            <p>Processing</p>
            <h2>{processingCount}</h2>
          </article>

          <article className="admin-orders-stat">
            <p>Shipped</p>
            <h2>{shippedCount}</h2>
          </article>

          <article className="admin-orders-stat">
            <p>Delivered</p>
            <h2>{deliveredCount}</h2>
          </article>

          <article className="admin-orders-stat admin-orders-sales">
            <p>Total Order Value</p>
            <h2>{formatCurrency(totalSales)}</h2>
          </article>
        </section>

        <section className="admin-orders-panel">
          <div className="admin-orders-panel-heading">
            <div>
              <h2>All Orders</h2>
              <p>{filteredOrders.length} order(s) found</p>
            </div>
          </div>

          <div className="admin-orders-filters">
            <input
              type="search"
              placeholder="Search by order ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search orders by order ID"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter orders by status"
            >
              <option value="All">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="admin-orders-empty">
              <h3>
                {orders.length === 0
                  ? 'No orders yet'
                  : 'No matching orders'}
              </h3>
              <p>
                {orders.length === 0
                  ? 'Customer orders will appear here once they are placed.'
                  : 'Try another order ID or status filter.'}
              </p>
            </div>
          ) : (
            <div className="admin-orders-table-wrap">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const status = getStatus(order);
                    const items = Array.isArray(order.items)
                      ? order.items
                      : [];

                    return (
                      <tr key={order.id}>
                        <td className="admin-order-id">
                          #{order.id}
                        </td>

                        <td>{formatDate(order.createdAt)}</td>

                        <td>
                          <div className="admin-order-items">
                            {items.length === 0 ? (
                              <span>No item details</span>
                            ) : (
                              <>
                                {items.map((item, index) => (
                                  <span
                                    key={`${order.id}-${item.productId || item.name}-${index}`}
                                  >
                                    {item.name || 'Product'} ×{' '}
                                    {Number(item.quantity || 0)}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        </td>

                        <td>{order.paymentMethod || 'Not specified'}</td>

                        <td className="admin-order-total">
                          {formatCurrency(order.total)}
                        </td>

                        <td>
                          <select
                            className={`admin-order-status status-${status.toLowerCase()}`}
                            value={status}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                event.target.value
                              )
                            }
                            aria-label={`Update status for order ${order.id}`}
                          >
                            {ORDER_STATUSES.map((stage) => (
                              <option key={stage} value={stage}>
                                {stage}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminOrders;