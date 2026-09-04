import React from 'react';

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-container">
        <span className="pill-badge">
          🇱🇰 Sri Lanka Healthcare Emergency Response
        </span>

                <h1 className="hero-title">
                    Stop Searching. Start Finding.<br />
                    <span style={{ color: 'var(--primary-500)' }}>Locate Life-Saving Medicines Instantly.</span>
                </h1>

                <p className="hero-description">
                    Over 60% of Sri Lankan patients visit up to 5 pharmacies during medicine shortages.
                    Medicine Finder SL aggregates real-time inventory from local pharmacies in Colombo, Kandy, Galle, and beyond—saving critical time and travel costs when every minute counts.
                </p>

                {/* Catchy Visual Feature Highlights */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <div className="pill-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                        ⚡ Real-time Stock Updates
                    </div>
                    <div className="pill-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                        📍 Distance-based Pharmacy Locator
                    </div>
                    <div className="pill-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                        💊 Chronic Care & Antibiotic Directory
                    </div>
                </div>

                {/* Impact Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-item">
                        <p className="stat-number">250+</p>
                        <p className="stat-label">Registered Islandwide Pharmacies</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-number">&lt; 10s</p>
                        <p className="stat-label">Instant Availability Search</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-number">100%</p>
                        <p className="stat-label">Free Community Platform</p>
                    </div>
                </div>
            </div>
        </section>
    );
}