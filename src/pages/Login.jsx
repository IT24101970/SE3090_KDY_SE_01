import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Invalid user credentials.');
                setLoading(false);
                return;
            }

            const { user, pharmacy } = data;

            // Trigger parent auth handler if available
            if (onLogin) {
                onLogin(user.role, user, pharmacy);
            }

            // Role-based redirection:
            // 1. Admin Role -> Admin Dashboard
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
                return;
            }

            // 2. Seller / Pharmacist Role -> Pharmacy Dashboard
            if (user.role === 'seller' || user.role === 'pharmacist') {
                if (pharmacy && pharmacy._id) {
                    navigate(`/pharmacy/${pharmacy._id}`);
                } else {
                    navigate('/pharmacy-dashboard');
                }
                return;
            }

            setError('Unknown user role. Access denied.');
        } catch (err) {
            console.error('Login request error:', err);
            setError('Login request failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '440px', margin: '60px auto', padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'left' }}>
            <h2 style={{ textAlign: 'center', marginTop: 0, color: '#0f172a', fontWeight: '700' }}>
                Portal Login
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Sign in with your User ID or Email to access your dashboard
            </p>

            {error && (
                <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                        User ID or Email Address
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. seller@healthplus.com or User ObjectId"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '6px', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
