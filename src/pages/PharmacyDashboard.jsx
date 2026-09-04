import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PharmacyDashboard() {
    const { pharmacyId } = useParams();
    const navigate = useNavigate();

    const [pharmacies, setPharmacies] = useState([]);
    const [activePharmacyId, setActivePharmacyId] = useState(pharmacyId || '');
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');

    // Edit stock modal state
    const [selectedItem, setSelectedItem] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Add new medicine modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addTab, setAddTab] = useState('existing'); // 'existing' | 'new'
    const [masterMedicines, setMasterMedicines] = useState([]);
    const [addMedicineId, setAddMedicineId] = useState('');
    const [addQuantity, setAddQuantity] = useState('50');

    // New medicine creation form state
    const [newMedName, setNewMedName] = useState('');
    const [newMedStrength, setNewMedStrength] = useState('');
    const [newMedPrice, setNewMedPrice] = useState('');

    const BASE_URL = '/api';

    // 1. Fetch available pharmacies on component mount
    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const res = await fetch(`${BASE_URL}/pharmacies`);
                if (res.ok) {
                    const list = await res.json();
                    setPharmacies(list);
                    if (!pharmacyId && list.length > 0) {
                        setActivePharmacyId(list[0]._id);
                    }
                }
            } catch (err) {
                console.error('Error fetching pharmacies:', err);
            }
        };
        fetchPharmacies();
    }, [pharmacyId]);

    // 2. Fetch inventory whenever activePharmacyId changes
    useEffect(() => {
        if (activePharmacyId) {
            fetchInventory(activePharmacyId);
        } else {
            setLoading(false);
        }
    }, [activePharmacyId]);

    const fetchInventory = async (id) => {
        try {
            setLoading(true);
            setErrorMsg('');
            const res = await fetch(`${BASE_URL}/inventory/pharmacy/${id}`);
            if (!res.ok) throw new Error('Failed to fetch inventory');
            const data = await res.json();
            setInventory(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setErrorMsg('Could not connect to database server. Please ensure the backend server is running (npm run server).');
        } finally {
            setLoading(false);
        }
    };

    // Open Add Medicine Modal and fetch master medicine catalog
    const handleOpenAddModal = async () => {
        try {
            setErrorMsg('');
            setAddTab('existing');
            const res = await fetch(`${BASE_URL}/inventory/medicines`);
            if (res.ok) {
                const meds = await res.json();
                setMasterMedicines(meds);
                if (meds.length > 0) {
                    setAddMedicineId(meds[0]._id);
                }
                setIsAddModalOpen(true);
            } else {
                throw new Error('Failed to fetch medicine catalog');
            }
        } catch (err) {
            console.error('Error loading medicine catalog:', err);
            setErrorMsg('Could not connect to database server.');
        }
    };

    // Submit Add Existing Medicine to Inventory
    const handleAddMedicineSubmit = async (e) => {
        e.preventDefault();
        if (!addMedicineId || addQuantity === '' || Number(addQuantity) < 0) {
            setErrorMsg('Please select a valid medicine and enter a non-negative quantity.');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pharmacyId: activePharmacyId,
                    medicineId: addMedicineId,
                    quantity: Number(addQuantity)
                })
            });

            if (!res.ok) throw new Error('Failed to add medicine to inventory');

            const newItem = await res.json();

            setInventory((prev) => {
                const exists = prev.some((item) => item._id === newItem._id);
                if (exists) {
                    return prev.map((item) => (item._id === newItem._id ? newItem : item));
                }
                return [...prev, newItem];
            });

            setIsAddModalOpen(false);
            setAddQuantity('50');
            setErrorMsg('');
        } catch (err) {
            console.error('Add inventory error:', err);
            setErrorMsg('Failed to add medicine to inventory.');
        }
    };

    // Create New Medicine in Catalog and Add to Inventory
    const handleCreateNewMedicineSubmit = async (e) => {
        e.preventDefault();
        if (!newMedName.trim() || !newMedStrength.trim() || !newMedPrice || Number(newMedPrice) <= 0 || !addQuantity || Number(addQuantity) < 0) {
            setErrorMsg('Please enter a valid medicine name, strength, price, and quantity.');
            return;
        }

        try {
            // 1. Create medicine document in Medicine collection
            const medRes = await fetch(`${BASE_URL}/inventory/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newMedName.trim(),
                    strength: newMedStrength.trim(),
                    price: Number(newMedPrice)
                })
            });

            if (!medRes.ok) throw new Error('Failed to create new medicine');
            const createdMed = await medRes.json();

            // 2. Add newly created medicine into active pharmacy inventory
            const invRes = await fetch(`${BASE_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pharmacyId: activePharmacyId,
                    medicineId: createdMed._id,
                    quantity: Number(addQuantity)
                })
            });

            if (!invRes.ok) throw new Error('Failed to add created medicine to inventory');
            const newItem = await invRes.json();

            setInventory((prev) => [...prev, newItem]);
            setIsAddModalOpen(false);
            setNewMedName('');
            setNewMedStrength('');
            setNewMedPrice('');
            setAddQuantity('50');
            setErrorMsg('');
        } catch (err) {
            console.error('Create medicine error:', err);
            setErrorMsg('Failed to create new medicine in catalog.');
        }
    };

    const handlePharmacyChange = (e) => {
        const id = e.target.value;
        setActivePharmacyId(id);
        navigate(`/pharmacy/${id}`);
    };

    const getStatus = (qty) => {
        if (qty === 0) return { label: 'Out of Stock', color: '#fee2e2', textColor: '#991b1b' };
        if (qty <= 10) return { label: 'Low Stock', color: '#fef3c7', textColor: '#92400e' };
        return { label: 'In Stock', color: '#d1fae5', textColor: '#065f46' };
    };

    // Update existing inventory quantity
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

    // Delete inventory item from pharmacy
    const handleDeleteInventory = async (item) => {
        if (!window.confirm(`Are you sure you want to remove ${item.medicineId?.name || 'this medicine'} from your store inventory?`)) {
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/inventory/${item._id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete item');

            setInventory((prev) => prev.filter((i) => i._id !== item._id));
        } catch (err) {
            console.error('Delete error:', err);
            setErrorMsg('Failed to remove item from inventory.');
        }
    };

    const filteredInventory = inventory.filter((item) =>
        item.medicineId?.name?.toLowerCase().includes(filterQuery.toLowerCase())
    );

    const activePharmacyObj = pharmacies.find(p => p._id === activePharmacyId);

    return (
        <div className="search-section" style={{ marginTop: '2rem' }}>
            <div className="about-card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                            🏥 Pharmacy Inventory Management
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                            Add medicines and update stock quantity levels in real time across Sri Lanka.
                        </p>
                    </div>

                    {/* Action Controls: Pharmacy Selector & Add Medicine Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {pharmacies.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-600)' }}>
                                    Select Pharmacy Store:
                                </label>
                                <select
                                    value={activePharmacyId}
                                    onChange={handlePharmacyChange}
                                    className="search-input"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, minWidth: '220px' }}
                                >
                                    {pharmacies.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} ({p.city})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="btn-primary"
                            style={{ height: '42px', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                            disabled={!activePharmacyId}
                        >
                            <span>➕</span> Add Medicine to Stock
                        </button>
                    </div>
                </div>

                {activePharmacyObj && (
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)', fontSize: '0.8125rem', color: 'var(--slate-600)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span>📍 <strong>Address:</strong> {activePharmacyObj.address}, {activePharmacyObj.city}</span>
                        <span>📞 <strong>Contact:</strong> {activePharmacyObj.contact}</span>
                        <span>⏰ <strong>Hours:</strong> {activePharmacyObj.openHours}</span>
                    </div>
                )}
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    ⚠️ {errorMsg}
                </div>
            )}

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
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredInventory.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                                    No inventory records found for this store. Click <strong>Add Medicine to Stock</strong> above to add items.
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
                                            LKR {item.medicineId?.price ? item.medicineId.price.toFixed(2) : '0.00'}
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
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
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
                                                <button
                                                    onClick={() => handleDeleteInventory(item)}
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.75rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        backgroundColor: '#fee2e2',
                                                        color: '#991b1b',
                                                        border: '1px solid #fca5a5',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal: Add Medicine to Inventory */}
            {isAddModalOpen && (
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
                    <div className="search-card" style={{ width: '100%', maxWidth: '480px', backgroundColor: '#ffffff' }}>
                        <h3 style={{ marginBottom: '0.25rem', fontWeight: '700' }}>
                            ➕ Add Medicine to Inventory
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                            Store: <strong>{activePharmacyObj?.name}</strong> ({activePharmacyObj?.city})
                        </p>

                        {/* Modal Tab Switcher */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
                            <button
                                type="button"
                                onClick={() => setAddTab('existing')}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    border: 'none',
                                    borderBottom: addTab === 'existing' ? '2px solid var(--primary-600)' : 'none',
                                    fontWeight: addTab === 'existing' ? 700 : 500,
                                    color: addTab === 'existing' ? 'var(--primary-700)' : 'var(--slate-600)',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Select Existing Medicine
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddTab('new')}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    border: 'none',
                                    borderBottom: addTab === 'new' ? '2px solid var(--primary-600)' : 'none',
                                    fontWeight: addTab === 'new' ? 700 : 500,
                                    color: addTab === 'new' ? 'var(--primary-700)' : 'var(--slate-600)',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                ➕ Create New Medicine
                            </button>
                        </div>

                        {addTab === 'existing' ? (
                            <form onSubmit={handleAddMedicineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Select Medicine from Catalog:
                                    </label>
                                    <select
                                        value={addMedicineId}
                                        onChange={(e) => setAddMedicineId(e.target.value)}
                                        className="search-input"
                                    >
                                        {masterMedicines.map((m) => (
                                            <option key={m._id} value={m._id}>
                                                {m.name} ({m.strength}) — LKR {m.price ? m.price.toFixed(2) : '0.00'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Initial Stock Quantity (Units):
                                    </label>
                                    <input
                                        type="number"
                                        value={addQuantity}
                                        onChange={(e) => setAddQuantity(e.target.value)}
                                        className="search-input"
                                        placeholder="Enter initial stock quantity"
                                        min="0"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                        Add to Stock
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
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
                        ) : (
                            <form onSubmit={handleCreateNewMedicineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Medicine Name:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dexamethasone"
                                        value={newMedName}
                                        onChange={(e) => setNewMedName(e.target.value)}
                                        className="search-input"
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }}>
                                            Strength:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 0.5mg or 10ml"
                                            value={newMedStrength}
                                            onChange={(e) => setNewMedStrength(e.target.value)}
                                            className="search-input"
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }}>
                                            Price (LKR):
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 25.00"
                                            value={newMedPrice}
                                            onChange={(e) => setNewMedPrice(e.target.value)}
                                            className="search-input"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }}>
                                        Initial Stock Quantity (Units):
                                    </label>
                                    <input
                                        type="number"
                                        value={addQuantity}
                                        onChange={(e) => setAddQuantity(e.target.value)}
                                        className="search-input"
                                        placeholder="Enter initial stock quantity"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                        Create & Add to Stock
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
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
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Edit Existing Stock Quantity */}
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
