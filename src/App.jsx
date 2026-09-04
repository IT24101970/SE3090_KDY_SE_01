import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import PharmacyDashboard from './pages/PharmacyDashboard';
import AddMedicine from './pages/AddMedicine';
import Header from './components/Header';
import Footer from './components/Footer';
import About from "./pages/About.jsx";


export default function App() {
    return (
        <Router>
            <div className="app-wrapper">
                <Header />

                <main className="main-content">
                    <Routes>

                        <Route path = "*" element={<h1>404 Not Found</h1>} />
                        
                        {/* Default/Home page */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/addmedicine" element={<AddMedicine />} />
                        <Route path="/add-medicine" element={<AddMedicine />} />


                        {/* Search page */}
                        <Route path="/search" element={<SearchPage />} />

                        <Route path ="/about" element={<About />} />
                        <Route
                            path="/pharmacy/:pharmacyId"
                            element={<PharmacyDashboard />}
                        />

                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}