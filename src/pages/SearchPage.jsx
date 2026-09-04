import React, { useState, useMemo } from 'react';
import sampleData from '../data/data.json';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [hasSearched, setHasSearched] = useState(false);

    // Relational data strictly matching Pharmacy, Medicine, and Inventory Mongoose models
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
        if (!searchTerm.trim() && selectedCity === 'All' && !hasSearched) {
            // Initial view: show all pharmacies with their available inventories
            return pharmacies.map(pharmacy => {
                const pharmacyInvs = inventories.filter(inv => inv.pharmacy === pharmacy._id && inv.quantity > 0);
                const availableMeds = pharmacyInvs.map(inv => {
                    const med = medicines.find(m => m._id === inv.medicine);
                    return med ? { ...med, quantity: inv.quantity } : null;
                }).filter(Boolean);

                return {
                    ...pharmacy,
                    availableMedicines: availableMeds
                };
            }).filter(p => p.availableMedicines.length > 0);
        }

        // 1. Find matching medicines by search term
        const matchingMeds = medicines.filter(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            m.strength.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        const matchingMedIds = new Set(matchingMeds.map(m => m._id));

        // 2. Find matching inventories with quantity > 0
        const matchingInvs = inventories.filter(inv =>
            matchingMedIds.has(inv.medicine) && inv.quantity > 0
        );

        // 3. Map inventories to Pharmacies and filter by City
        const resultMap = {};

        matchingInvs.forEach(inv => {
            const pharmacy = pharmacies.find(p => p._id === inv.pharmacy);
            const medicine = medicines.find(m => m._id === inv.medicine);

            if (pharmacy && medicine) {
                const matchesCity = selectedCity === 'All' || pharmacy.city.toLowerCase() === selectedCity.toLowerCase();
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
    }, [searchTerm, selectedCity, hasSearched, pharmacies, medicines, inventories]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setHasSearched(true);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCity('All');
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
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setHasSearched(true);
                            }}
                            className="search-input"
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label htmlFor="city-select-input" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                            Pharmacy City / Location
                        </label>
                        <select
                            id="city-select-input"
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setHasSearched(true);
                            }}
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
                        {(searchTerm || selectedCity !== 'All') && (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        Pharmacies with Available Stock ({searchResults.length})
                    </h3>
                    {(searchTerm || selectedCity !== 'All') && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                            Filtered by: {searchTerm ? `"${searchTerm}"` : 'All medicines'} {selectedCity !== 'All' ? `in ${selectedCity}` : ''}
                        </span>
                    )}
                </div>

                {searchResults.length === 0 ? (
                    <div className="about-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#ffffff' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💊</div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                            No matching pharmacies found
                        </h4>
                        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '450px', margin: '0 auto' }}>
                            We couldn't find any pharmacy in <strong>{selectedCity === 'All' ? 'any city' : selectedCity}</strong> currently stocking <strong>"{searchTerm}"</strong>. Try checking spelling or selecting another city.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="btn-primary"
                            style={{ marginTop: '1.25rem', fontSize: '0.875rem' }}
                        >
                            Show All Available Stock
                        </button>
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
