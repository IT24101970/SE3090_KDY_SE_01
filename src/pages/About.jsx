import React from 'react';

export default function About() {
    return (
        <div className="about-container">
            <h1>About Medicine Finder SL</h1>
            <p className="about-intro">
                Bridging the information gap between Sri Lankan patients and essential pharmaceutical supplies during localized drug shortages.
            </p>

            <section className="about-card">
                <h2>🇱🇰 The Challenge in Sri Lanka</h2>
                <p>
                    Following supply chain bottlenecks, patients across Sri Lanka routinely visit 3 to 5 different pharmacies to fulfill a single prescription. Critical chronic care drugs—such as insulin, cardiac medication, and pediatric antibiotics—frequently experience localized stockouts.
                </p>
            </section>

            <div className="about-grid">
                <section className="about-card">
                    <h2>💡 Our Solution</h2>
                    <p>
                        Medicine Finder SL provides a lightweight, real-time inventory query engine. By aggregating stock reports across local community pharmacies, patients can locate active supply instantly before traveling.
                    </p>
                </section>

                <section className="about-card">
                    <h2>🚀 Core Features</h2>
                    <ul className="about-list">
                        <li><strong>District Filtering:</strong> Quickly check stock in Colombo, Kandy, Galle, and major centers.</li>
                        <li><strong>Live Stock Indicators:</strong> Categorized as Available, Low Stock, or Out of Stock.</li>
                        <li><strong>Crowdsourced Alerts:</strong> Community-driven reports for emergency prescriptions.</li>
                    </ul>
                </section>
            </div>

            <section className="about-card meta-card">
                <h2>📌 Project Info</h2>
                <p>
                    Developed for the <strong>SE3090 Software Engineering Frameworks Mini Hackathon</strong>. Built using React, Vite, and custom CSS variables.
                </p>
            </section>
        </div>
    );
}