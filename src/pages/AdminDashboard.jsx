import React from 'react';

export default function AdminDashboard({ user }) {
    const adminEmail = user?.email || 'admin@pharmacy.com';

    return (
        <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px', textAlign: 'left' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: '700' }}>
                        🛡️ System Admin Dashboard
                    </h1>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                        Logged in as: <strong>{adminEmail}</strong>
                    </p>
                </div>
                <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                    System Administrator
                </span>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Registered Pharmacies</h3>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '8px 0 0 0' }}>4</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Pending Approvals</h3>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', margin: '8px 0 0 0' }}>1</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Total Listed Medicines</h3>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb', margin: '8px 0 0 0' }}>6</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Active Shortage Alerts</h3>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626', margin: '8px 0 0 0' }}>2</p>
                </div>
            </div>

            {/* Approvals Table */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '18px', color: '#0f172a', marginTop: 0, marginBottom: '16px', fontWeight: '700' }}>
                    Pharmacy Approvals & Verification
                </h2>
                <div style={{ border: '1px solid #f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '13px', color: '#475569' }}>
                        <span>Pharmacy Name</span>
                        <span>City</span>
                        <span>Status</span>
                        <span>Action</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', alignItems: 'center', borderTop: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <span>HealthPlus Pharmacy</span>
                        <span>Colombo</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>Active</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Verified</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', alignItems: 'center', borderTop: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <span>Lanka Care Pharmacy</span>
                        <span>Kandy</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>Active</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Verified</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', alignItems: 'center', borderTop: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <span>MediQuick Pharmacy & Wellness</span>
                        <span>Galle</span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>Active</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Verified</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', alignItems: 'center', borderTop: '1px solid #f1f5f9', fontSize: '14px' }}>
                        <span>City Pharma Colombo</span>
                        <span>Colombo</span>
                        <span style={{ color: '#d97706', fontWeight: '600' }}>Pending</span>
                        <div>
                            <button style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
