import React from 'react';
import { useHistory } from 'react-router-dom';

function LogoutButton() {
  const history = useHistory();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');

    // Redirect the user to the login page or home page
    history.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
