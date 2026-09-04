import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import PharmacyDashboard from './pages/PharmacyDashboard';
import AddMedicine from './pages/AddMedicine';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import About from "./pages/About";

export default function App() {
    const [userRole, setUserRole] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPharmacy, setCurrentPharmacy] = useState(null);

    const handleLogin = (role, user, pharmacy) => {
        setUserRole(role);
        setCurrentUser(user);
        setCurrentPharmacy(pharmacy);
    };

    const handleLogout = () => {
        setUserRole(null);
        setCurrentUser(null);
        setCurrentPharmacy(null);
    };

    return (
        <Router>
            <div className="app-wrapper">
                <Header userRole={userRole} currentUser={currentUser} onLogout={handleLogout} />

                <main className="main-content">
                    <Routes>
                        {/* Default/Home page */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />

                        {/* Authentication */}
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />

                        {/* Dashboards */}
                        <Route path="/admin" element={<AdminDashboard user={currentUser} />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard user={currentUser} />} />

                        <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
                        <Route path="/pharmacy/:pharmacyId" element={<PharmacyDashboard />} />

                        {/* Other Pages */}
                        <Route path="/addmedicine" element={<AddMedicine />} />
                        <Route path="/add-medicine" element={<AddMedicine />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/about" element={<About />} />

                        {/* 404 Fallback */}
                        <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center' }}><h1>404 Not Found</h1></div>} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}