import React, { useState } from 'react';
import './homepage.css';
import { Link } from 'react-router-dom';
import fridgerLogo from '../../assets/Logo.png';

function HomePage() {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">
          <img src={fridgerLogo} alt="Fridger Logo" style={{ width: '50px', marginRight: '10px' }} /> {/* Logo display */}
          Fridger
        </div>
        <nav className="nav-bar">
          <Link className="nav-item" to="/features">Features</Link>
          <Link className="nav-item" to="/about">About Us</Link>
          <Link className="nav-item" to="/login">Login</Link>
          <Link className="cta-button" to="/register">Sign Up</Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <h1>Welcome to Fridger</h1>
          <p>Streamline your kitchen experiences with smart grocery management.</p>
          <Link to="/register" className="cta-button big">Get Started</Link>
        </section>

        <section className="features-section">
          <h2>Discover Fridger's Features</h2>
          <button className="cta-button" onClick={toggleDetails}>
            {showDetails ? 'Hide Details' : 'Learn More'}
          </button>
          {showDetails && (
            <div className="features-grid">
              <div className="feature-item">
                <h3>Smart Expiry Tracking</h3>
                <p>Get notifications before your groceries expire, reducing waste and saving money.</p>
              </div>
              <div className="feature-item">
                <h3>Inventory Insights</h3>
                <p>Visualize your fridge contents with our intuitive dashboard, making meal planning a breeze.</p>
              </div>
              <div className="feature-item">
                <h3>Shopping List Organizer</h3>
                <p>Automatically generate shopping lists based on consumption patterns and preferences.</p>
              </div>
              <div className="feature-item">
                <h3>Recipe Suggestions</h3>
                <p>Discover new recipes based on what you already have in your fridge, ensuring you make the most of every ingredient.</p>
              </div>
            </div>
          )}
        </section>

        <section className="about-section">
          <h2>About Fridger</h2>
          <p>Fridger is your ultimate kitchen companion, designed to simplify the way you manage your groceries and plan your meals. Built with the modern household in mind, Fridger brings technology to the heart of your kitchen.</p>
        </section>

        <section className="get-started-section">
          <h2>Ready to Transform Your Kitchen with Fridger?</h2>
          <Link to="/register" className="cta-button big">Join Now</Link>
        </section>
      </main>

      <footer className="footer">
        <p>© 2023 Fridger - All rights reserved</p>
      </footer>
    </div>
  );
}

export default HomePage;
