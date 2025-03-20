import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./stlyes.css"; // Ensure correct filename

const socket = io("http://localhost:5010");

const AdminPollResults = () => {
  const [pollCode, setPollCode] = useState("");
  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  // Fetch poll results from the backend
  const fetchPollResults = async () => {
    if (!pollCode) {
      setError("❌ Please enter a poll code.");
      return;
    }
    setError("");

    try {
      const response = await fetch(`http://localhost:5010/poll-results/${pollCode}`);
      if (!response.ok) {
        throw new Error("❌ Invalid poll code or poll not found.");
      }

      const data = await response.json();
      console.log("📊 API Response:", data); // Debugging log
      setPollTitle(data.pollTitle);
      setOptions(data.options);
    } catch (error) {
      console.error("❌ Failed to fetch poll results:", error);
      setError("❌ Invalid poll code or poll not found.");
    }
  };

  // Listen for real-time vote updates
  useEffect(() => {
    socket.on("voteUpdate", (data) => {
      console.log("📩 Received live update:", data);
      if (data.code === pollCode) {
        setOptions(data.results);
      }
    });

    return () => socket.off("voteUpdate");
  }, [pollCode]);

  return (
    <div className="admin-container">
      <h2>📊 Poll Results</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Poll Code"
          value={pollCode}
          onChange={(e) => setPollCode(e.target.value)}
          className="poll-input"
        />
        <button onClick={fetchPollResults} className="fetch-button">🔍 Fetch Results</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {pollTitle && (
        <div className="results-container">
          <h3 className="poll-title">📢 {pollTitle}</h3>
          {options.length > 0 ? (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option) => (
                  <tr key={option.id}>
                    <td>{option.option_text}</td>
                    <td>{option.vote_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-votes">No votes yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPollResults;
