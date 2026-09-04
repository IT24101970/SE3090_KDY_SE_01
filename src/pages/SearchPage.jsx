import React, { useState, useMemo } from 'react';
import sampleData from '../data/data.json';

export default function SearchPage() {
    // Form input state
    const [searchTermInput, setSearchTermInput] = useState('');
    const [selectedCityInput, setSelectedCityInput] = useState('All');

    // Applied search query state
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [appliedCity, setAppliedCity] = useState('All');
    const [hasSearched, setHasSearched] = useState(false);

    // data matching Pharmacy, Medicine, and Inventory Mongoose models
    const pharmacies = sampleData.pharmacies || [];
    const medicines = sampleData.medicines || [];
    const inventories = sampleData.inventories || [];

    // Dynamically derive list of cities from Pharmacy records
    const cities = useMemo(() => {
        const uniqueCities = Array.from(new Set(pharmacies.map(p => p.city))).filter(Boolean);
        return ['All', ...uniqueCities.sort()];
    }, [pharmacies]);

    // Relational join execution across Medicine, Inventory, and Pharmacy models

    const searchResults = useMemo(() => {
        if (!hasSearched) {
            // Initial view before clicking search
            return [];
        }

        // Find matching medicines by applied search term
        const matchingMeds = medicines.filter(m =>
            m.name.toLowerCase().includes(appliedSearchTerm.toLowerCase().trim()) ||
            m.strength.toLowerCase().includes(appliedSearchTerm.toLowerCase().trim())
        );
        const matchingMedIds = new Set(matchingMeds.map(m => m._id));

        // Find matching inventories with quantity > 0
        const matchingInvs = inventories.filter(inv =>
            matchingMedIds.has(inv.medicine) && inv.quantity > 0
        );

        //  Map inventories to Pharmacies and filter by applied City
        const resultMap = {};

        matchingInvs.forEach(inv => {
            const pharmacy = pharmacies.find(p => p._id === inv.pharmacy);
            const medicine = medicines.find(m => m._id === inv.medicine);

            if (pharmacy && medicine) {
                const matchesCity = appliedCity === 'All' || pharmacy.city.toLowerCase() === appliedCity.toLowerCase();
                if (matchesCity) {
                    if (!resultMap[pharmacy._id]) {
                        resultMap[pharmacy._id] = {
                            ...pharmacy,
                            availableMedicines: []
                        };
                    }
                    resultMap[pharmacy._id].availableMedicines.push({
                        ...medicine,
                        quantity: inv.quantity,
                        inventoryId: inv._id
                    });
                }
            }
        });

        return Object.values(resultMap);
    }, [appliedSearchTerm, appliedCity, hasSearched, pharmacies, medicines, inventories]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearchTerm(searchTermInput);
        setAppliedCity(selectedCityInput);
        setHasSearched(true);
    };

    const handleClearFilters = () => {
        setSearchTermInput('');
        setSelectedCityInput('All');
        setAppliedSearchTerm('');
        setAppliedCity('All');
        setHasSearched(false);
    };

    return (
        <div className="search-section">
            {/* Search Filter Header Card */}
            <div className="search-card">
                <div className="search-card-header">
                    <h2 className="search-card-title">Pharmacy Medicine Stock Finder</h2>
                    <p className="search-card-subtitle">
                        Find medicine availability, location, contact details, and operating hours across pharmacies.
                    </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="search-form">
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="medicine-search-input" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                            Medicine Name
                        </label>
                        <input
                            id="medicine-search-input"
                            type="text"
                            placeholder="e.g. Paracetamol, Amoxicillin..."
                            value={searchTermInput}
                            onChange={(e) => setSearchTermInput(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="city-select-input" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                            Pharmacy City / Location
                        </label>
                        <select
                            id="city-select-input"
                            value={selectedCityInput}
                            onChange={(e) => setSelectedCityInput(e.target.value)}
                            className="search-input"
                        >
                            {cities.map(city => (
                                <option key={city} value={city}>
                                    {city === 'All' ? 'All Cities' : city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <button type="submit" className="btn-primary" style={{ height: '46px' }}>
                            Search Stock
                        </button>
                        {(searchTermInput || selectedCityInput !== 'All' || hasSearched) && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="btn-secondary-xs"
                                style={{ height: '46px', padding: '0 1rem' }}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Results Header & Grid */}
            <div style={{ marginTop: '2rem' }}>
                {hasSearched && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                            Pharmacies with Available Stock ({searchResults.length})
                        </h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                            Filtered by: {appliedSearchTerm ? `"${appliedSearchTerm}"` : 'All medicines'} {appliedCity !== 'All' ? `in ${appliedCity}` : ''}
                        </span>
                    </div>
                )}

                {!hasSearched ? (
                    <div className="about-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#ffffff' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                            Search Pharmacy Medicine Stock
                        </h4>
                        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto' }}>
                            Enter a medicine name (e.g. <em>Paracetamol</em>, <em>Amoxicillin</em>) or select a city above and click <strong>Search Stock</strong> to find available pharmacies.
                        </p>
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="about-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#ffffff' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💊</div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                            No matching pharmacies found
                        </h4>
                        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '450px', margin: '0 auto' }}>
                            We couldn't find any pharmacy in <strong>{appliedCity === 'All' ? 'any city' : appliedCity}</strong> currently stocking <strong>"{appliedSearchTerm}"</strong>. Try checking spelling or selecting another city.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                        {searchResults.map(pharmacy => (
                            <div key={pharmacy._id} className="pharmacy-result-card">
                                {/* Pharmacy Header Info */}
                                <div className="pharmacy-card-header">
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            <h4 className="pharmacy-title">{pharmacy.name}</h4>
                                            <span className="pharmacy-city-badge">📍 {pharmacy.city}</span>
                                        </div>
                                        <p className="pharmacy-address">
                                            {pharmacy.address}
                                        </p>
                                    </div>

                                    {/* Meta pills: Contact & Operating Hours */}
                                    <div className="pharmacy-meta-group">
                                        <div className="pharmacy-meta-item">
                                            <span style={{ fontSize: '0.875rem' }}>📞</span>
                                            <strong style={{ color: 'var(--slate-800)' }}>Contact:</strong>
                                            <a href={`tel:${pharmacy.contact}`} style={{ color: 'var(--primary-700)', textDecoration: 'none', fontWeight: 600 }}>
                                                {pharmacy.contact}
                                            </a>
                                        </div>
                                        <div className="pharmacy-meta-item">
                                            <span style={{ fontSize: '0.875rem' }}>⏰</span>
                                            <strong style={{ color: 'var(--slate-800)' }}>Open Hours:</strong>
                                            <span style={{ color: 'var(--slate-600)' }}>{pharmacy.openHours}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Available Medicines List */}
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-200)' }}>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                                        Matching Medicine Inventory ({pharmacy.availableMedicines.length})
                                    </div>
                                    <div className="medicine-inventory-grid">
                                        {pharmacy.availableMedicines.map((med) => (
                                            <div key={med._id || med.inventoryId} className="medicine-item-card">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                                    <div>
                                                        <div className="medicine-name">{med.name}</div>
                                                        <div className="medicine-strength">Strength: {med.strength}</div>
                                                    </div>
                                                    <span className={`stock-badge ${med.quantity >= 10 ? 'in-stock' : 'low-stock'}`}>
                            {med.quantity >= 10 ? 'In Stock' : 'Low Stock'}
                          </span>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--slate-200)' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                            LKR {med.price.toFixed(2)}
                          </span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 500 }}>
                            Qty Available: <strong>{med.quantity}</strong>
                          </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

