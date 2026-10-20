import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    let users = [];

    try {
      users = JSON.parse(localStorage.getItem('shopSphereUsers') || '[]');

      if (!Array.isArray(users)) {
        users = [];
      }
    } catch {
      setError('Unable to read saved accounts. Please try again.');
      return;
    }

    const email = form.email.trim().toLowerCase();

    const user = users.find(
      (savedUser) =>
        savedUser.email === email &&
        savedUser.password === form.password
    );

    if (!user) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    localStorage.setItem('shopSphereCurrentUser', JSON.stringify(user));
    navigate(location.state?.from?.pathname||'/');
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-card">
          <p className="auth-eyebrow">WELCOME BACK</p>
          <h1>Log in to ShopSphere</h1>
          <p className="auth-description">
            Sign in to continue shopping and manage your orders.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button className="auth-submit" type="submit">
              Log In →
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </section>
      </main>
    </>
  );
}

export default Login;
