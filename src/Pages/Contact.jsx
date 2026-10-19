import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../Components/Navbar';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: '', message: '' });

    try {
      await emailjs.send(
        'service_wrlsezh',
        'template_b6nawls',
        {
          from_name: form.from_name,
          from_email: form.from_email,
          subject: form.subject,
          message: form.message,
        },
        {
          publicKey: 'VvyCLCj9AnQ6_hjgj',
        }
      );

      setStatus({
        type: 'success',
        message: 'Thanks for contacting ShopSphere! Your message has been sent.',
      });

      setForm({
        from_name: '',
        from_email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('EmailJS error:', error);

      setStatus({
        type: 'error',
        message: 'Sorry, your message could not be sent. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-heading">
          <p className="contact-eyebrow">WE'RE HERE TO HELP</p>
          <h1>Let's talk.</h1>
          <p>
            Have a question about an order or a product?
            Send us a message and we'll be happy to help.
          </p>
        </section>

        <section className="contact-card">
          <div className="contact-card-heading">
            <h2>Send us a message</h2>
            <p>Fill in the details below to get in touch.</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-field">
              <label htmlFor="from_name">Your name</label>
              <input
                id="from_name"
                name="from_name"
                type="text"
                placeholder="Enter your name"
                value={form.from_name}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="from_email">Email address</label>
              <input
                id="from_email"
                name="from_email"
                type="email"
                placeholder="you@example.com"
                value={form.from_email}
                onChange={handleChange}
                required
                maxLength={254}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What can we help with?"
                value={form.subject}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="message">Your message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                maxLength={3000}
              />
            </div>

            {status.message && (
              <p
                className={`contact-status ${status.type}`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              className="contact-submit"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Contact;