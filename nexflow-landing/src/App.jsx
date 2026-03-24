import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import GlobalThreatMap from './components/GlobalThreatMap';
import ProductPreview from './components/ProductPreview';
import ThreatMap from './components/ThreatMap';
import Features from './components/Features';
import Metrics from './components/Metrics';
import CTA from './components/CTA';
import ComplianceBar from './components/ComplianceBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen" style={{ backgroundColor: '#050505' }}>
            <Hero />
            <GlobalThreatMap />
            <ProductPreview />
            <ThreatMap />
            <Features />
            <Metrics />
            <CTA />
            <ComplianceBar />
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App
