import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/create-poll")}>Create New Poll</button>
      <button onClick={() => navigate("/results")}>Veiw poll results</button>
    </div>
  );
};

export default AdminDashboard;
