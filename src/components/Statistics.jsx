import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import Sidebar from "./Sidebar";
import "../css/Statistics.css";
import { useNavigate, Navigate } from "react-router-dom";

const FavoriteListUserChart = () => {
  const [data, setData] = useState([]); // Revenue Data
  const [dataOrder, setDataOrder] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [ownerRegistration, setOwnerRegistration] = useState([]);
  const [userRegistration, setUserRegistration] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  const adminEmail = localStorage.getItem("AdminEmail");
  const navigate = useNavigate();

  if (!isAuthenticated || !adminEmail) {
    return <Navigate to="/LOGIN" />;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setData([]);

      const response = await fetch(`/api/OwnerStatistics/revenue-per-month/${year}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();

      // Validate and format
      const formatted = result.map(item => ({
        MonthName: item.monthName,
        TotalRevenue: item.totalRevenue/100,
      }));

      setData(formatted);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Failed to load revenue data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRevenue = () => {
    const parsedYear = parseInt(year, 10);
    const currentYear = new Date().getFullYear();

    if (!parsedYear || parsedYear < 2000 || parsedYear > currentYear) {
      setError("Please enter a valid year (2000 - current year).");
      setData([]);
      return;
    }

    setYear(parsedYear);
    fetchData();
  };


  /** Fetch Accepted Owners Per Month */
  useEffect(() => {
    fetch("/api/AdminStatistics/AcceptedOwnersPerMonth")
      .then((response) => response.json())
      .then((data) => {
        const allMonths = Array.from({ length: 12 }, (_, i) => {
          return {
            month: new Date(0, i).toLocaleString("en-US", { month: "short" }), // "Jan", "Feb", ...
            count: 0,
          };
        });
  
        const apiData = data.map((item) => ({
          month: new Date(0, item.month - 1).toLocaleString("en-US", { month: "short" }),
          count: item.count,
        }));
  
        const mergedData = allMonths.map((monthItem) => {
          const match = apiData.find((d) => d.month === monthItem.month);
          return match || monthItem;
        });
  
        setOwnerRegistration(mergedData);
      })
      .catch((error) => console.error("Error fetching owner registration data:", error));
  }, []);
  
  

  /** Fetch Users Per Month */
  useEffect(() => {
    fetch("/api/AdminStatistics/user-monthly-count")
      .then((response) => response.json())
      .then((data) => {
        const allMonths = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleString("en-US", { month: "short" }), // "Jan", "Feb", ...
          totalUsers: 0,
        }));
  
        const apiData = data.map((item) => ({
          month: new Date(0, item.month - 1).toLocaleString("en-US", { month: "short" }),
          totalUsers: item.totalUsers,
        }));
  
        const mergedData = allMonths.map((monthItem) => {
          const match = apiData.find((d) => d.month === monthItem.month);
          return match || monthItem;
        });
        
  
        setUserRegistration(mergedData);
      })
      .catch((error) => console.error("Error fetching user registration data:", error));
  }, []);
  

  /** Fetch Top Shops by Order Count */
  useEffect(() => {
    fetch("/api/AdminStatistics/owners-orders")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data
          .map((item) => ({
            name: item.ownerName,
            ordercount: item.orderCount,
            ownerId: item.ownerId,
          }))
          .sort((a, b) => b.orderCount - a.orderCount)
          .slice(0, 10);
        setDataOrder(formattedData);
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, []);

  /** Fetch Total Income */
  useEffect(() => {
    fetch("/api/AdminStatistics/TotalIncome", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Admin-Email": adminEmail,
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch total income");
        return response.json();
      })
      .then((data) => setTotalIncome(data.totalIncome))
      .catch((error) => setError("Failed to load total income"));
  }, [adminEmail]);

  /** Navigate to Owner Details */
  const handleOwnerClick = (ownerId) => {
    navigate(`/OwnerDetails/${ownerId}`);
  };

  return (
    <div>
      <Sidebar />
      {error && <div className="error-message">{error}</div>}

      <div className="income-box">Total Income: ${totalIncome/100}</div>

      <div className="parent2">
        {/* Shops by Order Count */}
        <div className="linechart2">
          <h2>Top 10 Shops by Order Counts</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataOrder} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ordercount" stroke="#8ad6ac" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Owners Per Month */}
        <div className="linechart2">
  <h2>Accepted Owners Per Month</h2>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={ownerRegistration}
      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="month"
        interval={0}
        angle={-45}
        textAnchor="end"
      />
      <YAxis />
      <Tooltip />
      <Bar
        dataKey="count"
        fill="#8ad6ac"
        barSize={40}
        radius={[5, 5, 0, 0]} // rounded top corners
      />
    </BarChart>
  </ResponsiveContainer>
</div>
      </div>

      {/* Total Users Per Month */}
      <div className="linechart2">
  <h2>Total Users Per Month</h2>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={userRegistration}
      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar
        dataKey="totalUsers"
        fill="#8ad6ac"
        barSize={40}
        radius={[5, 5, 0, 0]} // Optional: rounded top corners
      />
    </BarChart>
  </ResponsiveContainer>
</div>

      <div className="linechart2">
      {/* Year Input & Fetch Button */}
      <div className="year-input-container">
      <h2>Total Revenue per year</h2>
  <input
    type="number"
    value={year}
    onChange={(e) => setYear(e.target.value)}
    placeholder="Enter Year"
  />
  <button onClick={handleFetchRevenue} className="fetch-button" disabled={loading}>
    {loading ? "Loading..." : "Show Revenue"}
  </button>
</div>
        {error && <p className="text-red-600 mt-2">{error}</p>}

      {data.length > 0 && (
        <div className="h-96">
         <ResponsiveContainer width="100%" height={400}>
  <BarChart data={data}>
    <XAxis dataKey="MonthName" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="TotalRevenue" fill="#8ad6ac" />
  </BarChart>
</ResponsiveContainer>
        </div>

      )}
            </div>
    </div>
  );
};

export default FavoriteListUserChart;
