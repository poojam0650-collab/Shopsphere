import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api';

function AdminDashboard() {
  const [productCount, setProductCount] = useState('--');
  const [orderCount, setOrderCount] = useState('--');
  const [totalSales, setTotalSales] = useState(0);
  const [customerCount, setCustomerCount] = useState('--');

  useEffect(() => {
    const loadDashboard = async () => {
      // Load products from MockAPI
      try {
        const response = await API.get('/products');

        if (Array.isArray(response.data)) {
          setProductCount(response.data.length);
        }
      } catch (error) {
        console.error('Unable to load products:', error);
      }

      // Load orders from localStorage
      try {
        const orders = JSON.parse(
          localStorage.getItem('shopSphereOrders') || '[]'
        );

        if (!Array.isArray(orders)) {
          throw new Error('Invalid order data');
        }

        setOrderCount(orders.length);

        const sales = orders.reduce((sum, order) => {
          return sum + Number(order.total || 0);
        }, 0);

        setTotalSales(sales);
      } catch (error) {
        console.error('Unable to load orders:', error);
      }
      // Load registered customers from localStorage
try {
  const users = JSON.parse(
    localStorage.getItem('shopSphereUsers') || '[]'
  );

  if (!Array.isArray(users)) {
    throw new Error('Invalid customer data');
  }

  setCustomerCount(users.length);
} catch (error) {
  console.error('Unable to load customers:', error);
}
    };

    loadDashboard();
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>ShopSphere</h2>
        <p className="admin-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin" className="active">
            Dashboard
          </Link>

          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/customers">Customers</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your ShopSphere admin panel.</p>
          </div>

          <span className="admin-badge">Admin</span>
        </header>

        <section className="admin-stats">
          <article className="admin-card">
            <p>Total Products</p>
            <h2>{productCount}</h2>
          </article>

          <article className="admin-card">
            <p>Total Orders</p>
            <h2>{orderCount}</h2>
          </article>

          <article className="admin-card">
            <p>Total Customers</p>
            <h2>{customerCount}</h2>
          </article>

          <article className="admin-card">
            <p>Total Sales</p>
            <h2>
              ₹{totalSales.toLocaleString('en-IN')}
            </h2>
          </article>
        </section>

        <section className="admin-welcome">
          <h2>Welcome to ShopSphere!</h2>
          <p>
            Manage your products, orders, and customers from
            one place.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;