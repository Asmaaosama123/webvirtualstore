import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Sidebar from "../components/Sidebar"; // Sidebar Component
import '../css/OwnerStatistics.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const OwnerStatistics = () => {
    const { ownerId } = useParams();
    const navigate = useNavigate();  // ✅ Import and use navigate
    const [stats, setStats] = useState(null);
    const [mostViewed, setMostViewed] = useState([]);
    const [ownerOrders, setOwnerOrders] = useState(null);  // ✅ Added state for owner orders
    const [ownerFavListCount, setFavListCount] = useState(null);  // ✅ Added state for owner orders
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ownerId) return;

        fetch(`/api/AdminStatistics/ProductStatistics/${ownerId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // DEBUGGING

                if (data.message) {
                    setError(data.message);
                } else {
                    setStats(data);
                    setMostViewed(Array.isArray(data.mostViewedProducts) ? data.mostViewedProducts : []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Error fetching product statistics");
                setLoading(false);
            });

            fetch(`/api/OwnerStatistics/owners-orders/${ownerId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Owner Orders API Response:", data);
                setOwnerOrders(data);
            })
            .catch((err) => console.error("Fetch error:", err));
      fetch(`/api/Owner/Owner/${ownerId}/Count`)
      .then((response)=>response.json())
      .then((data)=>{
        console.log("owners favlist api ",data);
        setFavListCount(data)
      })
      .catch((err)=>console.error("fetch failed",err));
    }, [ownerId]);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    // ✅ Define handleBack function to go back
    const handleBack = () => {
        navigate(-1);  // ✅ Navigates to the previous page
    };

    // Bar Chart Data
    const chartData = {
        labels: ["Total Products", "Products on Sale"],
        datasets: [
            {
                label: "Product Count",
                data: [stats.totalProducts, stats.productsOnSale],
                backgroundColor: ["#3498db", "#e67e22"],
                borderRadius: 1,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar - FIXED WIDTH */}
            <Sidebar className="sidebar" />

            {/* Main Content - FIXED FLEX DISPLAY */}
            <div className="main-content">
                {/* Product Statistics */}
                <div className="parent">
                <div className="product-stats">
                    {/* <h2>Product Statistics</h2>
                    <p>Total Products: {stats.totalProducts}</p>
                    <p>Products on Sale: {stats.productsOnSale}</p> */}
  {/* Owner Orders */}
                  
                    {/* Most Viewed Products */}
                    <p>Most Viewed Products</p>
                    {mostViewed.length > 0 ? (
                        <ul >
                            {mostViewed.map((product, index) => (
                                <li className="number"  key={index}>
                                    {product.name} - {product.views} views
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="number">No products.</p>
                    )}
                </div>
<div className="main-content2">
<p>Owner Orders</p>
                    {ownerOrders ? (
                        <p className="number">{ownerOrders.orderCount}</p>
                    ) : (
                        <p>Loading orders...</p>
                    )}
</div>
<div className="main-content2">
<p>Owner FavListCount</p>
                    {ownerFavListCount ? (
                        <p className="number">{ownerFavListCount.countofusers}</p>
                    ) : (
                        <p>Loading countofusers...</p>
                    )}
</div>
</div>
                {/* Histogram */}
                <div className="chart-container1">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true } },
                        }}
                    />
                </div>
            </div>

            {/* ✅ Add Back Button with Working Function */}
            <button className="back" onClick={handleBack}>
                Back
            </button>
        </div>
    );
};

export default OwnerStatistics;
