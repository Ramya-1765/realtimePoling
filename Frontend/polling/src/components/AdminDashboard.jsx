import React from "react";
import { useNavigate } from "react-router-dom";
import "./stlyes.css"; 

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        <button className="dashboard-button" onClick={() => navigate("/create-poll")}>
          Create New Poll
        </button>
        <button className="dashboard-button" onClick={() => navigate("/results")}>
         View Poll Results
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
