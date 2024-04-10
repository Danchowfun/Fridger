import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import cartLogo from '../../assets/Logo.png';
import DefaultLogo from '../../assets/default-logo.svg';

function NavigationBar({ userImage }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // This function handles the logout process directly

  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the auth token
    history.push('/login'); // Redirect to login page
  };

  return (
    <div className="navigation-bar">
      <div className="logo-section">
        <img src={cartLogo} alt="Fridger" className="logo"/>
        <span>Fridger</span>
      </div>
      <div className="links-section">
        <Link exact to="/habit-summary" activeClassName="active-link">Habit Summary</Link>
        <Link to="/grocery-management" activeClassName="active-link">Grocery Management</Link>
        <Link to="/recommendations" activeClassName="active-link">Recommendations</Link>
        {/* More links here */}
      </div>
      <div className="user-section" onClick={togglePopup}>
        <img src={DefaultLogo} alt="User" className="user-image" />
        <span>{username}</span> {/* Display username */}
      </div>
      {isPopupOpen && (
        <div className="user-popup">
          <Link to="/account-information">Account Information</Link>
          <Link to="/subscription-details">Subscription Information</Link>
          <div onClick={handleLogout} style={{cursor: 'pointer', color: '#001943', padding: '10px', textDecoration: 'none'}}>Log Out</div>
        </div>
      )}
    </div>
  );
}

export default NavigationBar;