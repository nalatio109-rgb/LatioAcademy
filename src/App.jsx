import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import ContactPage from './pages/ContactPage';
import InstructorsPage from './pages/InstructorsPage';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/ScrollToTop';
import FloatingContact from './components/FloatingContact';

const MainLayout = ({ children }) => {
  return (
    <div className="hero-wrapper">
      <div className="glow-bg">
        <div className="glow-ellipse-1"></div>
        <div className="glow-ellipse-2"></div>
        <div className="glow-ellipse-3"></div>
      </div>
      <div className="cute-floating-container">
        <div className="cute-item item-pencil"><i className="ph ph-pencil-line"></i></div>
        <div className="cute-item item-book"><i className="ph ph-book-open"></i></div>
        <div className="cute-item item-palette"><i className="ph ph-palette"></i></div>
        <div className="cute-item item-cap"><i className="ph ph-graduation-cap"></i></div>
        <div className="cute-item item-ruler"><i className="ph ph-ruler"></i></div>
        <div className="cute-item item-bulb"><i className="ph ph-lightbulb"></i></div>
        <div className="cute-item item-backpack"><i className="ph ph-backpack"></i></div>
        <div className="cute-item item-scissors"><i className="ph ph-scissors"></i></div>
        <div className="cute-item item-brush"><i className="ph ph-paint-brush"></i></div>
        <div className="cute-item item-notebook"><i className="ph ph-notebook"></i></div>
        <div className="cute-item item-coffee"><i className="ph ph-coffee"></i></div>
        <div className="cute-item item-smiley"><i className="ph ph-smiley"></i></div>
      </div>
      <div className="container">
        <Navbar />
        {children}
      </div>
      <Footer />
      <FloatingContact />
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminPage />} />
      <Route
        path="*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/instructors" element={<InstructorsPage />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
