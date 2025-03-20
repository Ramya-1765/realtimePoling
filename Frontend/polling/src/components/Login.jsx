import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./stlyes.css";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5010/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin); // Save role info

      if (res.data.isAdmin) {
        navigate("/create-poll"); 
      } else {
        navigate("/vote"); 
      }
    } catch (error) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
