import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/stylesheet.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Handle password reset request
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Client-side email format validation
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!email.match(emailRegex)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Log the email to ensure it's being sent in the request body
    console.log('Sending email in request:', { email });

    try {
      // Create FormData to match 'multipart/form-data' content type
      const formData = new FormData();
      formData.append('email', email); // Append email to FormData

      const response = await fetch('/api/Account/ForgotPassword', {
        method: 'POST',
        headers: {
          'accept': '*/*', // Accept any response format
        },
        body: formData, // Send the FormData object as the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);

        if (errorData.errors && errorData.errors.email) {
          setError(errorData.errors.email[0]);
        } else {
          setError(errorData.message || 'Password reset failed');
        }
        return;
      }

      // Handle success response
      const successData = await response.json();
      setMessage(successData.message || 'Password reset link has been sent to your email.');
      setResetLink(successData.resetLink);
      setToken(successData.token);

      // Navigate to the reset password page, passing email and token as query parameters
      navigate(`/ResetPassword?email=${encodeURIComponent(email)}&token=${encodeURIComponent(successData.token)}`);

    } catch (err) {
      setError(`Request failed: ${err.message}`);
      console.error('Request failed:', err);
    }
  };

const goBackToLOGIN=()=>{
  navigate("/LOGIN");
}
  return (
    <div id="login-page">
    <div id="container">
      <h2 id="title">Forgot Password</h2>

      {message && <div className="message">{message}</div>}
      {resetLink && (
        <div>
          <p>Reset Link: <a href={resetLink} target="_blank" rel="noopener noreferrer">{resetLink}</a></p>
          <p>Token: {token}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <form onSubmit={handlePasswordReset}>
        <div>
          {/* <label htmlFor="email">Email</label> */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <button type="submit" id="btn">Next</button>
        <button type="submit" id="btn" onClick={goBackToLOGIN}>Back</button>
      </form>
    </div>
    </div>
  );
};

export default ForgetPassword;
