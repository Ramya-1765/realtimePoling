// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://localhost:5010/login", {
//         username,
//         password,
//       });

//       localStorage.setItem("token", response.data.token);
//       alert("Login successful!");

//       // Decode JWT to check if the user is admin
//       const decoded = JSON.parse(atob(response.data.token.split(".")[1]));
//       if (decoded.isAdmin) {
//         navigate("/admin");
//       } else {
//         navigate("/vote");
//       }
//     } catch (error) {
//       alert("Login failed. Please check your credentials.");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        navigate("/create-poll"); // Admin goes to Create Poll Page
      } else {
        navigate("/vote"); // User goes to Voting Page
      }
    } catch (error) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="mb-2 p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mb-2 p-2 border" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
