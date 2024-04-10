// DashboardPage.js
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import GroceryManager from './GroceryManager';
import ReceiptUploader from './ReceiptUploader';
import NavigationBar from './NavigationBar';
import { GroceryProvider } from './GroceryContext'; // Make sure the path is correct

function DashboardPage() {
  const [, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = decodeToken(token);
      setUsername(decoded.username);
    }
  }, []);

  function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

  return (
    <GroceryProvider> {/* Wrap components with the context provider */}
      <div className="dashboard">
        <NavigationBar />
        <div className="main-content">
            <div className="grocery-manager">
              <GroceryManager />
            </div>
            <div className="receipt-uploader">
              <ReceiptUploader />
            </div>
        </div>
      </div>
    </GroceryProvider>
  );
}

export default DashboardPage;
