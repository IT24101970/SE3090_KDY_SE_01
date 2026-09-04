import React from 'react';

export default function Header({ appName = "Medicine.js Finder", countryTag = "SL" }) {
    return (
        <header className="app-header">
            <div className="header-container">
                {/* Brand Logo & Title */}
                <div className="brand-logo">
                    <span style={{ fontSize: '1.5rem' }}>💊</span>
                    <a href="/home" className="nav-link">
                        <span className="brand-title">
                            Medicine Finder<span className="badge-country">SL</span>
                        </span>
                    </a>

                </div>

                {/* Navigation Links */}
                <nav className="app-nav">
                    <a href="/search" className="nav-link">Search</a>
                    <a href="/pharmacy-dashboard" className="nav-link">Dashboard</a>
                    <a href="/about" className="nav-link">About</a>
                </nav>
            </div>
        </header>
    );
}