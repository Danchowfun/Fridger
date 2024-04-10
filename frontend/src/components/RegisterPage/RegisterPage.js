import React, { useState } from 'react';
import './register.css'; // Make sure the path is correct
import { useHistory, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make an API call to your backend
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      console.log(`${process.env.REACT_APP_API_BASE_URL}/api/user/register`)
      // Check if the registration was successful
      if (!response.ok) {
        // Handle errors returned from the server, e.g., email already in use
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // If successful, you might want to log the user in directly
      // Or confirm the registration and redirect them to the login page
      alert('Registration successful. Please login.');
      history.push('/login');
    } catch (error) {
      // Display error message or handle error
      alert(error.message); // Basic error handling
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="form-function">
        <div className="form-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="register-button">Register</button>
        <p className="back-to-home">
          <Link to="/">Back to Home</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
