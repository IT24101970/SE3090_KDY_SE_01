import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ userRole, currentUser, onLogout }) {
    const navigate = useNavigate();

    return (
        <header className="app-header">
            <div className="header-container">
                {/* Brand Logo & Title */}
                <div className="brand-logo">
                    <span style={{ fontSize: '1.5rem' }}>💊</span>
                    <Link to="/home" className="nav-link">
                        <span className="brand-title">
                            Medicine Finder<span className="badge-country">SL</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="app-nav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/search" className="nav-link">Search</Link>
                    <Link to="/about" className="nav-link">About</Link>

                    {userRole ? (
                        <>
                            {userRole === 'admin' ? (
                                <Link to="/admin-dashboard" className="nav-link" style={{ fontWeight: '600', color: '#b45309' }}>
                                    🛡️ Admin Dashboard
                                </Link>
                            ) : (
                                <Link to="/pharmacy-dashboard" className="nav-link" style={{ fontWeight: '600', color: '#0369a1' }}>
                                    🏥 Pharmacy Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    if (onLogout) onLogout();
                                    navigate('/login');
                                }}
                                style={{
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #cbd5e1',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="nav-link"
                            style={{
                                backgroundColor: '#0284c7',
                                color: '#ffffff',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '13px'
                            }}
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}