// UserProfile.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import "../../styles/NavBar/profile.css";

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData"));

  // Memoize user initials for performance
  const userInitials = useMemo(() => {
    if (userData?.name) {
      return userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return userData?.email?.[0]?.toUpperCase() || 'U';
  }, [userData]);

  if (!userData?.email) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDropdownOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("userData");
    setIsDropdownOpen(false);
    window.location.reload(); // Refresh to update the UI
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    console.log('Navigate to settings');
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    console.log('Navigate to profile');
  };

  return (
    <div className="user-profile">
      <button
        ref={profileRef}
        className="user-circle"
        onClick={toggleDropdown}
        aria-label={`User menu for ${userData.email}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {userInitials}
        <div className="status-indicator"></div>
      </button>

      <div
        ref={dropdownRef}
        className={`user-dropdown ${isDropdownOpen ? 'active' : ''}`}
        role="menu"
        aria-hidden={!isDropdownOpen}
      >
        <div className="user-info">
          <div className="user-avatar-large">
            {userInitials}
          </div>
          <div className="user-details">
            {userData.name && (
              <div className="user-name">{userData.name}</div>
            )}
            <div className="user-email">{userData.email}</div>
          </div>
        </div>

        <div className="dropdown-divider"></div>

        <button
          className="dropdown-option"
          onClick={handleProfile}
          role="menuitem"
        >
          <span className="option-icon">👤</span>
          View Profile
        </button>

        <button
          className="dropdown-option"
          onClick={handleSettings}
          role="menuitem"
        >
          <span className="option-icon">⚙️</span>
          Settings
        </button>

        <div className="dropdown-divider"></div>

        <button
          className="dropdown-option logout-option"
          onClick={handleSignOut}
          role="menuitem"
        >
          <span className="option-icon">🚪</span>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;