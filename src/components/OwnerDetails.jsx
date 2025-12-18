import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Sidebar from './Sidebar'; // Import Sidebar
import '../css/Detailsstyle.css'; // Add this for layout adjustment
import defaultImage from '../image/default-image.jpg';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

const AdminDashboard = () => {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [showDeleteReasonInput, setShowDeleteReasonInput] = useState(false);
  const navigate = useNavigate();
  const { ownerId } = useParams();

  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const adminEmail = localStorage.getItem('AdminEmail');

  if (!isAuthenticated || !adminEmail) {
    return <Navigate to="/LOGIN" />;
  }

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const response = await fetch(`/api/Admin/GetOwnerDetails/${ownerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Admin-Email': adminEmail,
          },
          credentials: 'include',
        });

        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        if (!response.ok) {
          try {
            const errorData = JSON.parse(responseText);
            setError(`Failed to fetch owner details: ${errorData.message || 'Unknown error'}`);
          } catch {
            setError(`Failed to fetch owner details: ${responseText}`);
          }
          setLoading(false);
          return;
        }

        const data = JSON.parse(responseText);
        setOwnerDetails(data);
        setLoading(false);
      } catch (error) {
        setError(`Network error or server unavailable: ${error.message}`);
        setLoading(false);
      }
    };

    if (ownerId) fetchOwnerDetails();
  }, [ownerId, adminEmail]);

  const handleStatusUpdate = async (status) => {
    setError(null);

    // Validation for Rejection Reason
    const regex = /^(?![\d\W]+$)(?![\W\d]+$)(?=.*[a-zA-Z]).+/;

    // Ensure rejection reason is at least 10 characters long
    if (status === 'Rejected') {
      if (!rejectionReason || rejectionReason.length < 5) {
        setError('Rejection Reason must be at least 5 characters long.');
        return;
      }

      // Ensure it contains at least one letter and not just numbers/special characters
      if (!regex.test(rejectionReason)) {
        setError('Rejection Reason must contain at least one letter and cannot consist only of numbers or special characters.');
        return;
      }
    }

    const body = {
      ownerId,
      status,
      rejectionReason: status === 'Rejected' ? rejectionReason : null,
    };

    if (status === 'Rejected' && !rejectionReason) {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch('/api/Admin/UpdateRequestStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        // Update owner details locally
        setOwnerDetails((prevDetails) => ({
          ...prevDetails,
          status,
          rejectionReason: status === 'Rejected' ? rejectionReason : prevDetails.rejectionReason,
        }));
        setRejectionReason(''); // Reset rejection reason field
        setShowRejectionInput(false); // Hide rejection input field

        // Navigate to AdminDashboard only after the rejection is confirmed
        if (status === 'Rejected') {
          Swal.fire({
            title: "Owner Rejected",
            text: "The owner has been rejected successfully.",
            icon: "success",
            confirmButtonText: "Go to Dashboard",
          }).then(() => {
            navigate("/AdminDashboard"); // Navigate after the confirmation
          });
        }
      } else {
        const errorResponse = await response.json().catch(() => ({}));
        const errorMessage = errorResponse.message || 'Unknown error occurred';
        setError(`Status update failed: ${errorMessage}`);
        console.log('Error response:', errorResponse);
      }
    } catch (error) {
      setError(`An error occurred during status update: ${error.message}`);
      console.error('Network or server error:', error);
    }
  };

  const handleDeleteOwner = async () => {
    setError(null);
  
    if (!ownerId) {
      setError("Owner ID is missing.");
      return;
    }
  
    if (deleteReason.trim() === '') {
      setError("Please provide a delete reason.");
      return;
    }
  
    if (deleteReason.length < 5) {
      setError("Delete Reason must be at least 5 characters long.");
      return;
    }
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Sending deleteReason as plain text (not wrapped in an object)
          const response = await fetch(`/api/Admin/Delete_Owner/${ownerId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Admin-Email": adminEmail,
            },
            credentials: "include", // Ensure you're sending cookies (if needed)
            body: JSON.stringify(deleteReason), // Directly sending deleteReason as string
          });
  
          console.log('API response status:', response.status);
          const responseText = await response.text();  // Logs response text for better inspection
  
          if (response.ok) {
            setOwnerDetails(null);
            Swal.fire({
              title: "Deleted!",
              text: "The owner has been deleted.",
              icon: "success",
            });
            navigate("/AdminDashboard");
          } else {
            setError(`Delete failed: ${responseText || 'Unknown error'}`);
            Swal.fire("Error!", responseText || "An error occurred while deleting the owner.", "error");
          }
        } catch (error) {
          setError(`An error occurred during deletion. Please try again.`);
          Swal.fire("Error!", "An error occurred while deleting the owner.", "error");
        }
      }
    });
  };
  


  return (
    <div className="dashboard-wrapper">
    <Sidebar />
    <div className="dashboard-content">
      <h2>Owner Details</h2>
  
      {/* Display the error message here only once */}
      {error && <div className="error">{error}</div>}
  
      {loading ? (
        <p>Loading owner details...</p>
      ) : ownerDetails ? (
        <div className="owner-details-container">
          {/* Owner Photo Section */}
          <div className="owner-photo-section">
          <img
                src={
                  ownerDetails.imageBase64
                    ? `data:image/jpeg;base64,${ownerDetails.imageBase64}`
                    : defaultImage // Use the imported image
                }
                alt="Owner"
                className="owner-photo"
              />

              <h3>{`${ownerDetails.fName} ${ownerDetails.lName}`}</h3>
              <p>{ownerDetails.email}</p>
              <p>{ownerDetails.phoneNumber}</p>
              <p>{ownerDetails.address}</p>
            </div>

            {/* Owner Details Section */}
            <div className="owner-details">
              <div className="owner-info">
                <p><h4>Shop Name:</h4> {ownerDetails.shop_Name}</p>
                <p><h4>Status:</h4> {ownerDetails.status}</p>
                <p><h4>Shop Description:</h4> {ownerDetails.shop_Description}</p>
                {/* Conditionally render rejection reason */}
                {ownerDetails.rejectionReason && ownerDetails.rejectionReason.trim() !== '' ? (
                  <p><h4>Rejection Reason:</h4> {ownerDetails.rejectionReason}</p>
                ) : null}
                       {(ownerDetails.deletereason==null)?null: <p> <h4>Delete Reason:</h4> {ownerDetails.deletereason}</p>}
              </div>

              {ownerDetails.status === 'Pending' && (
                <div className="button-group">
                  <button className="btn accept" onClick={() => handleStatusUpdate('Accepted')}>
                    Accept
                  </button>
                  <button className="btn reject" onClick={() => setShowRejectionInput(true)}>
                    Reject
                  </button>
                  {showRejectionInput && (
                    <div>
                      <textarea
                        className="textarea"
                        placeholder="Enter rejection reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows="4"
                      />
                      <button className="btn confirm-reject" onClick={() => handleStatusUpdate('Rejected')}>
                        Confirm Reject Reason
                      </button>
                      <button
        className="btn cancel"
        onClick={() => {
          setRejectionReason(''); // Reset rejection reason
          setShowRejectionInput(false); // Hide input area
        }}
      >
        Cancel
      </button>
                    </div>
                  )}
                </div>
              )}

{ownerDetails.status === 'Accepted' && (
                <div>
                  <button className="btn delete" onClick={() => setShowDeleteReasonInput(true)}>
                    Delete
                  </button>
                  {showDeleteReasonInput && (
                    <div>
                      <textarea
                        className="textarea"
                        placeholder="Enter delete reason"
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        rows="4"
                      />
                                         <button className="btn confirm-reject" onClick={handleDeleteOwner}>Confirm Delete Reason</button>
                      <button className="btn cancel" onClick={() => { setDeleteReason(''); setShowDeleteReasonInput(false); }}>
                        Cancel
                      </button>
                    </div>
                  )}
                  {/* <button className='statics' onClick={() => navigate(`/OwnerStatistics/${ownerId}`)}>
  View Product Statistics
</button> */}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No owner details found.</p>
        )}

      </div>
      
    </div>
  );
};
export default AdminDashboard;
