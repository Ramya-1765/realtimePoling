import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import CreatePoll from "./components/CreatePoll";
import VotingPage from "./components/VotingPage";
import Register from "./components/Register";
import AdminPollResults from "./components/AdminPollResults";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dash" element={<AdminDashboard/>} />
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/results" element={<AdminPollResults />} />
      </Routes>
    </Router>
  );
}

export default App;
