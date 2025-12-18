import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/stylesheet.css';

const ResetPassword = () => {
  const [Email, setEmail] = useState('');
  const [Token, setToken] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill Email and Token from state
  useEffect(() => {
    if (location.state && location.state.email && location.state.token) {
      setEmail(location.state.email); // Pre-fill email
      setToken(location.state.token); // Pre-fill token
    }
  }, [location]);

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true); // Start loading

    // Check if passwords match
    if (NewPassword !== ConfirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Email', Email);
      formData.append('Token', Token);
      formData.append('NewPassword', NewPassword);
      formData.append('ConfirmPassword', ConfirmPassword);

      const response = await fetch('/api/Account/ResetPassword', {
        method: 'POST',
        headers: {
          accept: '*/*',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Password reset failed');
      }

      setMessage('Your password has been reset successfully.');
      setError('');
      setLoading(false);
      navigate('/LOGIN'); // Redirect to login after success
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false); // End loading
    }
  };

  // Navigate back to forget password
  const goBackToForget = () => {
    navigate('/ResetPassword');
  };

  return (
    <div id="login-page">
      <div id="container1">
        <h2 id="title">Reset Password</h2>
        {message && <div className="message">{message}</div>}
        {error && <div className="error">{error}</div>}

        <form onSubmit={handlePasswordReset}>
          <div>
            <input
              type="password"
              value={NewPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              id="email"
            />
          </div>
          <div>
            <input
              type="password"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              id="email"
            />
          </div>
          <button type="submit" id="btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button type="button" id="btn" onClick={goBackToForget}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
