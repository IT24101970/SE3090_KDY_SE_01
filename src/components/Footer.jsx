import React from 'react';

export default function Footer() {
    const handleContactClick = () => {
        alert("Emergency Hotline / Support: +94 11 234 5678\nEmail: support@medicinefinder.lk");
    };

    return (
        <footer className="app-footer-compact">
            <div className="footer-compact-container">
                {/* Brand & Tagline */}
                <div className="footer-brand">
                    <span>💊</span>
                    <span className="brand-title-sm">
                        Medicine Finder <span className="badge-country">SL</span>
                    </span>
                    <span className="footer-divider">•</span>
                    <span className="footer-tagline">Connecting Sri Lankan patients with active pharmacy stock.</span>
                </div>

                {/* Action Buttons & Copyright */}
                <div className="footer-actions">
                    {/*<button className="btn-secondary-xs" onClick={handleContactClick}>*/}
                    {/*    📞 Contact Support*/}
                    {/*</button>*/}
                    <a href="/about" className="btn-secondary-xs">
                        ℹ️ About
                    </a>
                </div>
            </div>

            <div className="footer-compact-bottom">
                <p>© 2026 Medicine Finder SL</p>
            </div>
        </footer>
    );
}