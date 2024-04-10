import React, { useState } from 'react';
import './login.css'; // Make sure the path is correct
import { useHistory } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_API_BASE_URL);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to login');
      }
      const { token, username } = await response.json();
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username); // Save username
      history.push('/dashboard');
    } catch (error) {
      console.error(error);
      setLoginError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Sign in</h1>
      </div>
      {loginError && <p className="login-error">{loginError}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="login-button" type="submit">Login</button>
      </form>
      <div className="social-login">
        <button className="facebook-login">Login with Facebook</button>
        <button className="apple-login">Login with Apple</button>
      </div>
      <div className="signup-prompt">
        <p>Don't have an account? <span className="signup-link" onClick={() => history.push('/register')}>Register</span></p>
      </div>
    </div>
  );
}

export default LoginPage;
