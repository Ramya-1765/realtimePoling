import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./stlyes.css";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5010/register", { username, password, isAdmin });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <h2 style={{color:'white'}}>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div className="role-selection">
          <label>
            <input type="radio" value="user" checked={!isAdmin} onChange={() => setIsAdmin(false)} /> User
          </label>
          <label>
            <input type="radio" value="admin" checked={isAdmin} onChange={() => setIsAdmin(true)} /> Admin
          </label>
        </div>

        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
