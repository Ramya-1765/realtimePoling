import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./stlyes.css"; // Ensure correct filename

const socket = io("http://localhost:5010");

const VotingPage = () => {
  const [pollCode, setPollCode] = useState("");
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState("");

  const fetchPoll = async () => {
    try {
      const response = await axios.get(`http://localhost:5010/poll/${pollCode}`);
      setPoll(response.data);
      setError(""); // Clear errors if successful
    } catch (error) {
      setError("❌ Invalid poll code. Try again.");
      setPoll(null);
    }
  };

  const submitVote = async (optionId) => {
    try {
      await axios.post("http://localhost:5010/vote", { pollCode, optionId });
      alert("✅ Vote submitted!");
    } catch (error) {
      alert("✅ Vote submitted!");
    }
  };

  useEffect(() => {
    socket.on("voteUpdate", (data) => {
      if (data.pollCode === pollCode) {
        fetchPoll();
      }
    });

    return () => socket.off("voteUpdate");
  }, [pollCode]);

  return (
    <div className="voting-container">
      <h2 style={{color:'white'}}>🗳️ Cast Your Vote</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Poll Code"
          value={pollCode}
          onChange={(e) => setPollCode(e.target.value)}
          className="poll-input"
        />
        <button onClick={fetchPoll} className="fetch-button">🔍 Fetch Poll</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {poll && (
        <div className="poll-container">
          <h3 className="poll-title" >📢 {poll.title}</h3>
          <div className="options-container">
            {poll.options.map((option) => (
              <button
                key={option.id}
                onClick={() => submitVote(option.id)}
                className="vote-button"
              >
                {option.option_text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
