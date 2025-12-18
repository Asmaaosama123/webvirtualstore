import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/stylesheet.css';

const ResetPassword = () => {
  const [Email, setEmail] = useState('');
  const [Token, setToken] = useState('');
  const [UserInputToken, setUserInputToken] = useState(''); // Input token from the user
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get('email');
    const tokenFromUrl = params.get('token');
    
    if (emailFromUrl && tokenFromUrl) {
      setEmail(emailFromUrl); // Store email from URL
      setToken(tokenFromUrl); // Store token from URL
    }
  }, [location]);

  // Handle token submission and validation
  const handleTokenSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Compare user input token with the stored token
    if (UserInputToken === Token) {
      navigate('/ResetPassword2', { state: { email: Email, token: Token } }); // Pass email and token to ResetPassword2 page
    } else {
      setError('Invalid token. Please try again.');
    }
  };

  // Handle navigation back to ForgetPassword page
  const goBackToForget = () => {
    navigate('/ForgetPassword');
  };

  return (
    <div id="login-page">
      <div id="container1">
        <h2 id="title">Reset Password</h2>
        {message && <div className="message">{message}</div>}
        {error && <div className="error">{error}</div>}

        {/* Token input form */}
        <form onSubmit={handleTokenSubmit}>
          <div>
            <input
              type="text"
              value={UserInputToken}
              onChange={(e) => setUserInputToken(e.target.value)}
              placeholder="Enter the reset token"
              required
              id="email"
            />
          </div>

          <button type="submit" id="btn">Next</button>
          <button type="button" id="btn" onClick={goBackToForget}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
