import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard'; 
import LOGIN from './components/LOGIN';  // Correct import
import OwnerDetails from './components/OwnerDetails';  // Correct import
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword'; // Import ResetPassword
import ResetPassword2 from './components/ResetPassword2';
import OwnerStatistics from './components/OwnerStatistics';
import Statistics from './components/Statistics';

 // Import ResetPassword
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/LOGIN" />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/OwnerDetails/:ownerId" element={<OwnerDetails />} />
        <Route path="/LOGIN" element={<LOGIN />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} /> {/* Add ResetPassword route */}
        <Route path="/ResetPassword2" element={<ResetPassword2 />} /> {/* Add ResetPassword route */}
        <Route path="/OwnerStatistics/:ownerId" element={<OwnerStatistics />} />
        <Route path="/Statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
