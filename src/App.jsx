import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';

import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
    return (
        <Router>
            <div className="app-wrapper">
                <Header />

                <main className="main-content">
                    <Routes>
                        {/* Default/Home page */}
                        <Route path="/" element={<Home />} />

                        {/* Search page */}
                        <Route path="/search" element={<SearchPage />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}