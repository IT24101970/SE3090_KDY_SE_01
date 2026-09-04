import React from 'react';

export default function Header({ appName = "Medicine Finder", countryTag = "SL" }) {
    return (
        <header className="app-header">
            <div className="header-container">
                {/* Brand Logo & Title */}
                <div className="brand-logo">
                    <span style={{ fontSize: '1.5rem' }}>💊</span>
                    <span className="brand-title">
            {appName} <span className="badge-country">{countryTag}</span>
          </span>
                </div>

                {/* Navigation Links */}
                <nav className="app-nav">
                    <a href="#search" className="nav-link">Search</a>
                    <a href="#about" className="nav-link">About Issue</a>
                </nav>
            </div>
        </header>
    );
}