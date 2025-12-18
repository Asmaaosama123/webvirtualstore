import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/stylesheet.css';

const LOGIN = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('Password', password);

      const response = await fetch('/api/Account/Login', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include credentials for session cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Only allow access to the admin dashboard if the email matches
      if (email === 'tshahd733@gmail.com') {
        localStorage.setItem('AdminEmail', email);
        localStorage.setItem('isAdminAuthenticated', 'true');
        console.log('Admin verified session created'); // Log message on successful login
        navigate('/AdminDashboard');
      } else {
        throw new Error('Not authorized as admin');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div id="login-page">
      {/* Full-Page Loading Overlay */}
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
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                id="email"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                id="password"
              />
            </div>
            <button type="submit" id="btn">Login</button>
          </form>
          <div>
            <a href="/ForgetPassword" id="link">
              Forgot Password?
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LOGIN;
