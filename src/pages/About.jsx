import React from 'react';

export default function About() {
    return (
        <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

            {/* 1. Hero Section with Background */}
            <section style={{
                position: 'relative',
                height: '280px',
                background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textAlign: 'center',
                padding: '0 20px'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    margin: 0
                }}>
                    Medicine Finder Sri Lanka
                </h1>
            </section>

            {/* 2. Floating 4-Card Action Grid */}
            <div style={{
                maxWidth: '1100px',
                margin: '-50px auto 60px auto',
                padding: '0 20px',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px'
                }}>

                    {/* Card 1: Fast Search */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '32px 24px 20px 24px',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        minHeight: '220px'
                    }}>
                        <div>
                            <div style={{ fontSize: '40px', color: '#003366', marginBottom: '12px' }}>🔍</div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#0f172a' }}>Fast Search</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                                Instant querying across daily brand names and generic formulas.
                            </p>
                        </div>
                        <span style={{ alignSelf: 'flex-end', fontSize: '16px', color: '#64748b', marginTop: '16px' }}>↗</span>
                    </div>

                    {/* Card 2: District Filter */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '32px 24px 20px 24px',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        minHeight: '220px'
                    }}>
                        <div>
                            <div style={{ fontSize: '40px', color: '#003366', marginBottom: '12px' }}>📍</div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#0f172a' }}>District Filter</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                                Locate stock in Colombo, Kandy, Galle, Jaffna, and major regional centers.
                            </p>
                        </div>
                        <span style={{ alignSelf: 'flex-end', fontSize: '16px', color: '#64748b', marginTop: '16px' }}>↗</span>
                    </div>

                    {/* Card 3: Phone Support */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '32px 24px 20px 24px',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        minHeight: '220px'
                    }}>
                        <div>
                            <div style={{ fontSize: '40px', color: '#003366', marginBottom: '12px' }}>📞</div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#0f172a' }}>Phone Support</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                                Emergency Helpline: +94 11 234 5678 for urgent medical supply queries.
                            </p>
                        </div>
                        <span style={{ alignSelf: 'flex-end', fontSize: '16px', color: '#64748b', marginTop: '16px' }}>↗</span>
                    </div>

                    {/* Card 4: Email Support */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '32px 24px 20px 24px',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        minHeight: '220px'
                    }}>
                        <div>
                            <div style={{ fontSize: '40px', color: '#003366', marginBottom: '12px' }}>✉️</div>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#0f172a' }}>Email Support</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                                Contact support@medicinefinder.lk for inventory status and updates.
                            </p>
                        </div>
                        <span style={{ alignSelf: 'flex-end', fontSize: '16px', color: '#64748b', marginTop: '16px' }}>↗</span>
                    </div>

                </div>
            </div>

            {/* 3. Bottom Split Section */}
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto 60px auto',
                padding: '0 20px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '40px',
                    alignItems: 'center'
                }}>

                    {/* Left Column: Information List */}
                    <div>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#0f172a',
                            margin: '0 0 8px 0'
                        }}>
                            The Healthcare Context & Initiative
                        </h2>
                        <div style={{ width: '40px', height: '3px', backgroundColor: '#0284c7', marginBottom: '24px' }}></div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }}>
                                • <strong style={{ color: '#0f172a' }}>The Challenge in Sri Lanka:</strong> Patients in Sri Lanka frequently visit 3 to 5 pharmacies during localized supply shortages just to fulfill a single prescription.
                            </li>
                            <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }}>
                                • <strong style={{ color: '#0f172a' }}>Our Solution:</strong> Medicine Finder SL offers a centralized directory showing live inventory status across local pharmacies before patients travel.
                            </li>
                            <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }}>
                                • <a href="tel:+94112345678" style={{ color: '#0284c7', fontWeight: '600', textDecoration: 'underline' }}>Phone Support</a>: Contact +94 11 234 5678 for emergency prescription aid.
                            </li>
                            <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }}>
                                • <a href="mailto:support@medicinefinder.lk" style={{ color: '#0284c7', fontWeight: '600', textDecoration: 'underline' }}>Email Assistance</a>: Write to support@medicinefinder.lk for inventory queries.
                            </li>

                        </ul>
                    </div>

                    {/* Right Column: Image */}
                    <div style={{
                        height: '280px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
                            alt="Medical Support Sri Lanka"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}