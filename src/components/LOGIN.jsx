import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/stylesheet.css';

const LOGIN = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'https://vstore2.runasp.net';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('Password', password);

      const response = await fetch(`${API_BASE}/api/Account/Login`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // مهم لو السيرفر عامل session
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // تأكدنا إن المستخدم أدمن
      if (data.role === 'Admin') {
        localStorage.setItem('AdminEmail', email);
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/AdminDashboard');
      } else {
        throw new Error('Not authorized as admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
