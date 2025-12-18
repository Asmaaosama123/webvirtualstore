import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/stylesheet.css';

const LOGIN = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // API base URL from environment variable or fallback
  const API_BASE = import.meta.env.VITE_API_URL || 'https://vstore2.runasp.net';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError('');     // Clear previous errors

    try {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('Password', password);

      const response = await fetch(`${API_BASE}/api/Account/Login`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include session cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Only allow access to the admin dashboard if the email matches
      if (email === 'tshahd733@gmail.com') {
        localStorage.setItem('AdminEmail', email);
        localStorage.setItem('isAdminAuthenticated', 'true');
        console.log('Admin verified session created');
        navigate('/AdminDashboard');
      } else {
        throw new Error('Not authorized as admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading in any case
    }
  };

  return (
    <div id="login-page">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Logging in, please wait...</p>
        </div>
      )}

      {!loading && (
        <div id="container">
          <h2 id="title">Login</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              id="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              id="password"
            />
            <button type="submit" id="btn">Login</button>
          </form>
          <div>
            <a href="/ForgetPassword" id="link">Forgot Password?</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LOGIN;
