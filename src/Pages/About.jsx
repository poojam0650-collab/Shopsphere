import Navbar from '../Components/Navbar';
import './About.css';

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <p className="about-label">ABOUT SHOPSPHERE</p>

          <h1>
            Shopping made
            <span> simple.</span>
          </h1>

          <p className="about-intro">
            We believe great shopping should feel effortless.
            ShopSphere brings everyday essentials and modern
            favorites together in one convenient place.
          </p>
        </section>

        <section className="about-story">
          <h2>More than just shopping.</h2>

          <p>
            ShopSphere is built around a simple idea:
            finding products you love should be easy,
            enjoyable, and convenient. From everyday
            essentials to thoughtful accessories, we're
            here to make discovering your next favorite
            product a better experience.
          </p>
        </section>

        <section className="about-values">
          <h2>What matters to us</h2>

          <div className="values-grid">
            <article className="value-card">
              <span>✦</span>
              <h3>Quality</h3>
              <p>
                Products selected with everyday needs
                and usefulness in mind.
              </p>
            </article>

            <article className="value-card">
              <span>♡</span>
              <h3>Customer First</h3>
              <p>
                A simple, friendly experience from
                browsing to checkout.
              </p>
            </article>

            <article className="value-card">
              <span>↗</span>
              <h3>Convenience</h3>
              <p>
                Discover, save, and manage your favorite
                products in one place.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;