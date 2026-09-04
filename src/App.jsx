import React from 'react';
import './index.css';

export default function App() {
  return (
      <div className="app-wrapper">
        {/* Navigation Header */}
        <header className="app-header">
          <div className="header-container">
            <div className="brand-logo">
              <span style={{ fontSize: '1.5rem' }}>💊</span>
              <span className="brand-title">
              Medicine Finder <span className="badge-country">SL</span>
            </span>
            </div>
            <nav className="app-nav">
              <a href="#search" className="nav-link">Search</a>
              <a href="#about" className="nav-link">About Issue</a>
            </nav>
          </div>
        </header>

        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-container">
            <span className="pill-badge">
              🇱🇰 Sri Lanka Healthcare Accessibility Initiative
            </span>

              <h1 className="hero-title">
                Find essential medicines in nearby Sri Lankan pharmacies—instantly.
              </h1>

              <p className="hero-description">
                Patients across Sri Lanka frequently visit 3 to 5 pharmacies just to locate a single prescription item.
                We bridge the post-crisis inventory gap by providing real-time stock status across registered local pharmacies.
              </p>

              {/* Quick Impact Stats */}
              <div className="stats-grid">
                <div className="stat-item">
                  <p className="stat-number">3–5</p>
                  <p className="stat-label">Pharmacies visited per prescription</p>
                </div>
                <div className="stat-item">
                  <p className="stat-number">Real-Time</p>
                  <p className="stat-label">Stock availability updates</p>
                </div>
                <div className="stat-item">
                  <p className="stat-number">Islandwide</p>
                  <p className="stat-label">Pharmacy network directory</p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Search Interface */}
          <section id="search" className="search-section">
            <div className="search-card">
              <div className="search-card-header">
                <h2 className="search-card-title">Search Prescription Stock</h2>
                <p className="search-card-subtitle">Enter your medicine name and select your district or region.</p>
              </div>

              <div className="search-form">
                <input
                    type="text"
                    placeholder="e.g., Paracetamol, Amoxicillin, Metformin..."
                    className="search-input"
                />
                <button className="btn-primary">
                  Search Availability
                </button>
              </div>
            </div>
          </section>

          {/* Sri Lanka Problem Explanation */}
          <section id="about" className="about-section">
            <div className="about-card">
              <h3 className="about-card-title">
                <span>📌</span> Why Medicine Finder SL Matters
              </h3>
              <p className="about-card-text">
                Supply chain bottlenecks in Sri Lanka frequently cause localized stock shortages for chronic care medications like insulin, cardiac drugs, and daily antibiotics. Medicine Finder SL provides an intuitive, crowdsourced platform helping patients locate nearby active stock immediately, saving valuable travel costs and time during medical emergencies.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Built for Sri Lanka | SE3090 Software Engineering Frameworks Mini Hackathon</p>
        </footer>
      </div>
  );
}