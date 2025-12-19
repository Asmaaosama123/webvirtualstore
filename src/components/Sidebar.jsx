import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css'; // Custom styles for the sidebar

const Sidebar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const API_BASE = "https://vstore2.runasp.net";

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/Account/Logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Remove authentication data from localStorage
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('AdminEmail');
        navigate('/LOGIN'); // Redirect to login
      } else {
        const errorResponse = await response.json();
        setError(`Logout failed: ${errorResponse.message}`);
      }
    } catch (error) {
      setError('An error occurred during logout. Please check your network connection or server status.');
    }
  };

  return (
    <div className="sidebar">
      <div className="menu-item" onClick={() => navigate('/AdminDashboard')}>
        Admin Dashboard
      </div>
      <div className="menu-item" onClick={() => navigate('/Statistics')}>
        Statistics
      </div>

      {/* <div className="menu-item" onClick={() => navigate('/Settings')}>
        Settings
      </div> */}
      <div
        className="menu-item"
        onMouseEnter={() => setShowLogout(true)}
        onMouseLeave={() => setShowLogout(false)}
      >
        More
        {showLogout && (
          <div className="logout-menu" onClick={handleLogout}>
            Logout
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
