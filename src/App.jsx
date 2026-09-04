import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';

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
                        {/* Default/Home page */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />

                        {/* Search page */}
                        <Route path="/search" element={<SearchPage />} />

                        <Route path ="/about" element={<About />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}