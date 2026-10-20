import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
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

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const email = form.email.trim().toLowerCase();

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

    const emailExists = users.some(
      (user) => user.email === email
    );

    if (emailExists) {
      setError('An account with this email already exists. Please log in.');
      return;
    }

    // Demo only: do not use real passwords with this localStorage approach.
    const newUser = {
      id: `USER-${Date.now()}`,
      name: form.name.trim(),
      email,
      phone: form.phone.trim(),
      address: form.address.trim(),
      password: form.password,
    };

    try {
      localStorage.setItem(
        'shopSphereUsers',
        JSON.stringify([...users, newUser])
      );
    } catch {
      setError('Unable to save your account in this browser.');
      return;
    }

    // Registration succeeds; the user must log in separately.
    navigate('/login', {
      state: { email },
    });
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-card">
          <p className="auth-eyebrow">WELCOME TO SHOPSPHERE</p>
          <h1>Create your account</h1>
          <p className="auth-description">
            Sign up to save your details and make checkout easier.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              required
            />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              maxLength={254}
              required
            />

            <label htmlFor="signup-phone">Phone number</label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label htmlFor="signup-address">Delivery address</label>
            <textarea
              id="signup-address"
              name="address"
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange}
              maxLength={500}
              rows={3}
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />

            <label htmlFor="signup-confirm-password">
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={8}
              required
            />

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button className="auth-submit" type="submit">
              Create Account →
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </main>
    </>
  );
}

export default Signup;