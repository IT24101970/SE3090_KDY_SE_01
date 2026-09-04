import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

export default function Home() {
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <main>
            <Hero />

            {/* Search Button Section */}
            <section className="search-section">
                <div className="search-card">
                    <div className="search-card-header">
                        <h2 className="search-card-title">
                            Find Your Medicine
                        </h2>

                        <p className="search-card-subtitle">
                            Search nearby pharmacies and check medicine availability.
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="btn-primary search-button"
                            onClick={handleSearchClick}
                        >
                            🔍 Search
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}