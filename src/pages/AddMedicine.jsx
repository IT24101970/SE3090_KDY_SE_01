import React, { useEffect, useState } from 'react';

export default function AddMedicine() {
    const [formData, setFormData] = useState({
        name: '',
        strength: '',
        price: ''
    });

    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch medicines from MongoDB via API
    const fetchMedicines = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/medicines');
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || `Failed to fetch medicines (Status: ${res.status})`);
            }
            const data = await res.json();
            setMedicines(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setErrorMessage(error.message || 'Unable to load medicines from server. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errorMessage) setErrorMessage('');
        if (successMessage) setSuccessMessage('');
    };

    // Add medicine
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Frontend validation
        const trimmedName = formData.name.trim();
        const trimmedStrength = formData.strength.trim();
        const rawPrice = formData.price;

        if (!trimmedName) {
            setErrorMessage('Medicine Name is required and cannot be blank.');
            return;
        }

        if (!trimmedStrength) {
            setErrorMessage('Strength is required and cannot be blank.');
            return;
        }

        if (rawPrice === '' || rawPrice === null || rawPrice === undefined || isNaN(Number(rawPrice))) {
            setErrorMessage('Price is required and must be a valid number.');
            return;
        }

        const numericPrice = Number(rawPrice);
        if (numericPrice < 0) {
            setErrorMessage('Price must be greater than or equal to 0.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/medicines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: trimmedName,
                    strength: trimmedStrength,
                    price: numericPrice
                })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || 'Failed to add medicine to database.');
            }

            // Immediately update the table with the created medicine from MongoDB
            setMedicines((prev) => [data, ...prev]);

            // Clear form
            setFormData({
                name: '',
                strength: '',
                price: ''
            });

            setSuccessMessage(`"${data.name}" was successfully added to inventory!`);
        } catch (error) {
            console.error('Error adding medicine:', error);
            setErrorMessage(error.message || 'Failed to add medicine. Server may be unavailable.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Search medicines by name or strength (case-insensitive)
    const filteredMedicines = medicines.filter((medicine) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        const nameMatch = (medicine.name || '').toLowerCase().includes(search);
        const strengthMatch = (medicine.strength || '').toLowerCase().includes(search);

        return nameMatch || strengthMatch;
    });

    // Singular / plural count label
    const medicineCountText = `${medicines.length} ${medicines.length === 1 ? 'medicine' : 'medicines'}`;

    return (
        <div className="add-medicine-page">
            <div className="add-medicine-container">

                {/* Page Header */}
                <div className="add-medicine-header">
                    <h1>Add Medicine</h1>
                    <p>Add a new medicine to your pharmacy inventory.</p>
                </div>

                {/* Status Banners */}
                {errorMessage && (
                    <div className="alert-message alert-error" role="alert">
                        <span className="alert-icon">⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="alert-message alert-success" role="alert">
                        <span className="alert-icon">✅</span>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Add Medicine Form Card */}
                <div className="medicine-form-card">
                    <h2>Add New Medicine</h2>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Medicine Name */}
                        <div className="form-group">
                            <label htmlFor="name">Medicine Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter medicine name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Strength */}
                        <div className="form-group">
                            <label htmlFor="strength">Strength</label>
                            <input
                                id="strength"
                                name="strength"
                                type="text"
                                placeholder="e.g. 500mg"
                                value={formData.strength}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="price">Price (LKR)</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            type="submit"
                            className="add-medicine-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                'Adding...'
                            ) : (
                                <>
                                    <span className="plus-icon">+</span> Add Medicine
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Medicine Table Section */}
                <div className="medicine-list-section">

                    {/* Table Header */}
                    <div className="medicine-list-header">
                        <h2>Added Medicines</h2>
                        <span className="medicine-count">
                            {medicineCountText}
                        </span>
                    </div>

                    {/* Search */}
                    <div className="medicine-search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search medicine by name or strength..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Loading, Empty, or Table */}
                    {isLoading ? (
                        <div className="loading-medicine-state">
                            <p>Loading medicines...</p>
                        </div>
                    ) : medicines.length === 0 ? (
                        <div className="empty-medicine-state">
                            <div className="empty-icon">+</div>
                            <h3>No medicines added yet</h3>
                            <p>Add your first medicine using the form above.</p>
                        </div>
                    ) : filteredMedicines.length === 0 ? (
                        <div className="empty-medicine-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No medicines found</h3>
                            <p>Try searching with a different medicine name or strength.</p>
                        </div>
                    ) : (
                        <div className="medicine-table-wrapper">
                            <table className="medicine-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Medicine Name</th>
                                        <th>Strength</th>
                                        <th>Price (LKR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedicines.map((medicine, index) => (
                                        <tr key={medicine._id || index}>
                                            <td className="medicine-number">
                                                {index + 1}
                                            </td>
                                            <td className="medicine-name-cell">
                                                {medicine.name}
                                            </td>
                                            <td>
                                                {medicine.strength}
                                            </td>
                                            <td className="price-cell">
                                                LKR {Number(medicine.price || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Search result information */}
                    {!isLoading && medicines.length > 0 && searchTerm && (
                        <p className="search-result-text">
                            Showing {filteredMedicines.length} of {medicines.length} medicines
                        </p>
                    )}

                </div>

            </div>
        </div>
    );
}
