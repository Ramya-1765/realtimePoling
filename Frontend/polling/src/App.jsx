import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CreatePoll from "./components/CreatePoll";
import VotingPage from "./components/VotingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/vote" element={<VotingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
