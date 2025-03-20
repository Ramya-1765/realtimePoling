import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="mb-2 p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mb-2 p-2 border" />

        <div className="mb-2">
          <label>
            <input type="radio" value="user" checked={!isAdmin} onChange={() => setIsAdmin(false)} /> User
          </label>
          <label className="ml-4">
            <input type="radio" value="admin" checked={isAdmin} onChange={() => setIsAdmin(true)} /> Admin
          </label>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
