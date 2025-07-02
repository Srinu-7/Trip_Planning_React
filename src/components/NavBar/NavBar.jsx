import React, { useEffect, useRef } from 'react';
import UserProfile from './UserProfile';
import "../../styles/NavBar/navbar.css";

const NavBar = () => {
  const userProfileRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.email) {
      userProfileRef.current.classList.add('active');
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Logo</div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="#" className="nav-link">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">
            About
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">
            Contact
          </a>
        </li>
      </ul>
      <div ref={userProfileRef} className="user-profile-container">
        <UserProfile />
      </div>
    </nav>
  );
};

export default NavBar;