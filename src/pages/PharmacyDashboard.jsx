import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PharmacyDashboard() {
    const { pharmacyId } = useParams();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Vite environment variable with fallback to local backend port
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (pharmacyId) {
            fetchInventory();
        }
    }, [pharmacyId]);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/inventory/pharmacy/${pharmacyId}`);
            if (!res.ok) throw new Error('Failed to fetch inventory');
            const data = await res.json();
            setInventory(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setErrorMsg('Could not load inventory from database.');
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (qty) => {
        if (qty === 0) return { label: 'Out of Stock', color: '#fee2e2', textColor: '#991b1b' };
        if (qty <= 10) return { label: 'Low Stock', color: '#fef3c7', textColor: '#92400e' };
        return { label: 'In Stock', color: '#d1fae5', textColor: '#065f46' };
    };

    const handleUpdateQuantity = async (e) => {
        e.preventDefault();
        if (newQuantity === '' || Number(newQuantity) < 0) {
            setErrorMsg('Please enter a valid non-negative quantity.');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/inventory/${selectedItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: Number(newQuantity) }),
            });

            if (!res.ok) throw new Error('Failed to update stock');

            const updatedItem = await res.json();

            setInventory((prev) =>
                prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
            );

            setSelectedItem(null);
            setNewQuantity('');
            setErrorMsg('');
        } catch (err) {
            console.error('Update error:', err);
            setErrorMsg('Failed to update quantity on server.');
        }
    };

    const filteredInventory = inventory.filter((item) =>
        item.medicineId?.name?.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
        <div className="search-section" style={{ marginTop: '2rem' }}>
            <div className="about-card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                    🏥 Pharmacy Inventory Management
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                    Update available stock levels to keep patient listings accurate across Sri Lanka.
                </p>
            </div>

            <div className="search-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Filter inventory by medicine name..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="search-input"
                    style={{ width: '100%' }}
                />
            </div>

            <div className="search-card" style={{ overflowX: 'auto' }}>
                {loading ? (
                    <p style={{ padding: '1.5rem', textAlign: 'center' }}>Loading inventory from database...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid var(--slate-200)', color: 'var(--slate-600)' }}>
                            <th style={{ padding: '0.75rem' }}>Medicine Name</th>
                            <th style={{ padding: '0.75rem' }}>Strength</th>
                            <th style={{ padding: '0.75rem' }}>Price (LKR)</th>
                            <th style={{ padding: '0.75rem' }}>Quantity</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredInventory.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                                    No inventory records found.
                                </td>
                            </tr>
                        ) : (
                            filteredInventory.map((item) => {
                                const status = getStatus(item.quantity);
                                return (
                                    <tr key={item._id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                                            {item.medicineId?.name || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '0.75rem', color: 'var(--slate-600)' }}>
                                            {item.medicineId?.strength || 'N/A'}
                                        </td>
                                        <td style={{ padding: '0.75rem', color: 'var(--slate-600)' }}>
                                            LKR {item.medicineId?.price || '0'}
                                        </td>
                                        <td style={{ padding: '0.75rem', fontWeight: '700' }}>
                                            {item.quantity} units
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                        <span
                            style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: status.color,
                                color: status.textColor,
                            }}
                        >
                          {status.label}
                        </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setNewQuantity(item.quantity);
                                                }}
                                                className="btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            >
                                                Edit Stock
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedItem && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                    }}
                >
                    <div className="search-card" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                        <h3 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>
                            Update Stock: {selectedItem.medicineId?.name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                            Strength: {selectedItem.medicineId?.strength}
                        </p>

                        <form onSubmit={handleUpdateQuantity} className="search-form" style={{ flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Current Units in Stock:</label>
                            <input
                                type="number"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                className="search-input"
                                placeholder="Enter new quantity"
                                min="0"
                            />

                            {errorMsg && (
                                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errorMsg}</p>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                    Save Stock
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedItem(null)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--slate-300)',
                                        backgroundColor: '#ffffff',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}