// NavBar.jsx
import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import "../../styles/NavBar/navbar.css";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <button 
            className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
          <div className="navbar-brand">
            <span className="brand-icon">✈️</span>
            Trip Planner
          </div>
        </div>

        <div className={`navbar-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
        
        <ul className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={closeMobileMenu}>
              <span className="nav-icon">🏠</span>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={closeMobileMenu}>
              <span className="nav-icon">ℹ️</span>
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={closeMobileMenu}>
              <span className="nav-icon">📞</span>
              Contact
            </a>
          </li>
        </ul>

        <div className="navbar-right">
          <UserProfile />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;