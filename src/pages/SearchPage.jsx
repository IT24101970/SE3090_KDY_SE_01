import React, { useState } from 'react';
import sampleData from '../data/data.json';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [errorMsg, setErrorMsg] = useState('');
    const [results, setResults] = useState(sampleData);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setErrorMsg('Please enter a medicine name to search.');
            return;
        }
        setErrorMsg('');

        // Filter logic
        const filtered = sampleData.filter(pharmacy => {
            const matchesDistrict = selectedDistrict === 'All' || pharmacy.district === selectedDistrict;
            const matchesMed = pharmacy.medicines.some(m =>
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterStatus === 'All' || m.status === filterStatus)
            );
            return matchesDistrict && matchesMed;
        });

        setResults(filtered);
    };

    return (
        <div className="search-section">
            <div className="search-card">
                <h2 className="search-card-title">Pharmacy Stock Finder</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search medicine (e.g. Paracetamol)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="search-input"
                    >
                        <option value="All">All Districts</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Kandy">Kandy</option>
                    </select>
                    <button type="submit" className="btn-primary">Search</button>
                </form>

                {errorMsg && <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}>{errorMsg}</p>}
            </div>

            {/* Results Display */}
            <div style={{ marginTop: '2rem' }}>
                <h3>Available Pharmacies ({results.length})</h3>
                {results.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>No pharmacies found matching your criteria.</p>
                ) : (
                    results.map(pharmacy => (
                        <div key={pharmacy.id} className="about-card" style={{ marginTop: '1rem' }}>
                            <h4>{pharmacy.name} ({pharmacy.district})</h4>
                            <p style={{ fontSize: '0.875rem', color: '#475569' }}>📍 {pharmacy.address} | 📞 {pharmacy.phone}</p>
                            <div style={{ marginTop: '0.5rem' }}>
                                {pharmacy.medicines.map((med, idx) => (
                                    <span key={idx} style={{
                                        display: 'inline-block',
                                        marginRight: '0.5rem',
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        backgroundColor: med.status === 'In Stock' ? '#d1fae5' : med.status === 'Low Stock' ? '#fef3c7' : '#fee2e2',
                                        color: med.status === 'In Stock' ? '#065f46' : med.status === 'Low Stock' ? '#92400e' : '#991b1b'
                                    }}>
                    {med.name}: {med.status}
                  </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}