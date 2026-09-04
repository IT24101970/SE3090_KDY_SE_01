import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
//import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
      <Router>
          <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
                <Route path="/search" element={<SearchPage />} />
              {/*
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<About />} />
              */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}