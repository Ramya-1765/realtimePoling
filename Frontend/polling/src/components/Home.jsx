import React from 'react'
import { useNavigate } from "react-router-dom";
import "./stlyes.css";
const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <h2>Real Time Polling</h2>
        <button className="dashboard-button" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="dashboard-button" onClick={() => navigate("/login")}>
         Login
        </button>
      </div>
    </div>
  )
}

export default Home