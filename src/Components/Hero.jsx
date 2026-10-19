import './Hero.css';
import  ShoppingBag  from '../assets/shopping-bag.jpg';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tag">YOUR STYLE, YOUR SPHERE</p>

        <h1>
          Find your next
          <br />
          <span>favorite thing.</span>
        </h1>

        <p className="hero-description">
          Discover thoughtfully selected essentials that
          bring style, comfort, and joy to your everyday life.
        </p>

        <a href="#products" className="hero-button">
          Explore Collection <span>→</span>
        </a>

        <div className="hero-note">
          ✦ Curated picks · Everyday essentials
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-circle">
          <img src={ShoppingBag} alt="shopping bag"
          className='hero-shopping-image' />
        </div>
        <div className="hero-badge">
          <span>✦</span> Made for your everyday
        </div>
      </div>
    </section>
  );
}

export default Hero;