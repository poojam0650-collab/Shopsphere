import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminCustomers.css';

function getCustomers() {
  try {
    const savedUsers = JSON.parse(
      localStorage.getItem('shopSphereUsers') || '[]'
    );

    return Array.isArray(savedUsers) ? savedUsers : [];
  } catch {
    return [];
  }
}

function AdminCustomers() {
  const [customers, setCustomers] = useState(getCustomers);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const syncCustomers = () => {
      setCustomers(getCustomers());
    };

    window.addEventListener('storage', syncCustomers);

    return () => {
      window.removeEventListener('storage', syncCustomers);
    };
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();

    return (
      String(customer.name || '').toLowerCase().includes(query) ||
      String(customer.email || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-customers-page">
      <aside className="admin-customers-sidebar">
        <h2>ShopSphere</h2>
        <p className="admin-customers-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/customers" className="active">
            Customers
          </Link>
        </nav>
      </aside>

      <main className="admin-customers-main">
        <header className="admin-customers-header">
          <div>
            <p className="admin-customers-eyebrow">
              SHOPSPHERE MANAGEMENT
            </p>
            <h1>Customers</h1>
            <p>View and manage your registered customers.</p>
          </div>

          <Link to="/admin" className="admin-customers-back">
            ← Dashboard
          </Link>
        </header>

        <section className="admin-customers-stats">
          <article className="admin-customers-stat">
            <div className="admin-customers-stat-icon">
              <span aria-hidden="true">👥</span>
            </div>
            <p>Total Registered Customers</p>
            <h2>{customers.length}</h2>
          </article>
        </section>

        <section className="admin-customers-panel">
          <div className="admin-customers-panel-heading">
            <div>
              <h2>All Customers</h2>
              <p>{filteredCustomers.length} customer(s) found</p>
            </div>
          </div>

          <div className="admin-customers-search">
            <input
              type="search"
              placeholder="Search by customer name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search customers by name or email"
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="admin-customers-empty">
              <h3>
                {customers.length === 0
                  ? 'No customers yet'
                  : 'No matching customers'}
              </h3>
              <p>
                {customers.length === 0
                  ? 'Registered customers will appear here after signup.'
                  : 'Try searching with a different name or email.'}
              </p>
            </div>
          ) : (
            <div className="admin-customers-table-wrap">
              <table className="admin-customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.id || customer.email || index}
                    >
                      <td>
                        <div className="admin-customer-name">
                          <span className="admin-customer-avatar">
                            {String(customer.name || 'C')
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <strong>{customer.name || 'Unnamed customer'}</strong>
                        </div>
                      </td>

                      <td>{customer.email || '—'}</td>
                      <td>{customer.phone || '—'}</td>
                      <td>{customer.address || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminCustomers;