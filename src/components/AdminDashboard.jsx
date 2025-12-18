import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/DashBoardStyle.css';
import { 
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [statistics, setStatistics] = useState({
    totalOwners: 0,
    acceptedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  });
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const adminEmail = localStorage.getItem('AdminEmail');

  if (!isAuthenticated || !adminEmail) {
    return <Navigate to="/LOGIN" />; 
  }

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch('/api/Admin/AllOwners', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Admin-Email': adminEmail,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Failed to fetch owners: ${errorData.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOwners(data);
        setLoading(false);
      } catch (error) {
        setError(`Network error or server unavailable: ${error.message}`);
        setLoading(false);
      }
    };

    fetchOwners();
  }, [adminEmail]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/AdminStatistics/ShopOwnerStatistics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Admin-Email": adminEmail,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();
        setStatistics(data);
        setChartData([
          { name: "Accepted", value: data.acceptedRequests },
          { name: "Pending", value: data.pendingRequests },
          { name: "Rejected", value: data.rejectedRequests },
        ]);
      } catch (error) {
        setError("Failed to load statistics");
      }
    };

    fetchStatistics();
  }, [adminEmail]);


  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">All Owners</h2>
        </div>

        <div className="chart-container">
          <h3>Requests Turnaround Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "Accepted" ? "#8ad6ac" : 
                      entry.name === "Pending" ? "#ffc107" : 
                      "#e34d5c"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {loading ? (
          <p>Loading owners...</p>
        ) : (
          <div className="owner-list">
            {owners.map((owner) => (
              <div
                key={owner.ownerId}
                className={owner.status === 'Pending' ? 'owner-card pending' : owner.status === 'Accepted' ? 'owner-card accepted' : 'owner-card unknown'}
                onClick={() => navigate(`/OwnerDetails/${owner.ownerId}`)}
              >
                <div className="owner-info">
                  <div className="owner-details">
                    <img
                      src={`data:image/jpeg;base64,${owner.imageBase64}`}
                      alt="Owner"
                      className="owner-image"
                    />
                  </div>
                  <div className="owner-details">
                    <span className="owner-name">Shop: {owner.shop_Name}</span>
                    <span className="shop-name">Owner: {owner.fName} {owner.lName}</span>
                  </div>
                </div>
                <div className="owner-meta">
                  <span className={owner.status === "Pending" ? "badge yellow" : owner.status === "Accepted" ? "badge green" : "badge gray"}>{owner.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
