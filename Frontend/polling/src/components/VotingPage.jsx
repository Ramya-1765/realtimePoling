import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5010");

const VotingPage = () => {
  const [pollCode, setPollCode] = useState("");
  const [poll, setPoll] = useState(null);

  const fetchPoll = async () => {
    try {
      const response = await axios.get(`http://localhost:5010/poll/${pollCode}`);
      setPoll(response.data);
    } catch (error) {
      alert("Invalid poll code.");
    }
  };

  const submitVote = async (optionId) => {
    try {
      await axios.post("http://localhost:5010/vote", { pollCode, optionId });
      alert("Vote submitted!");
    } catch (error) {
      alert("Error submitting vote.");
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
    <div>
      <h2>Vote</h2>
      <input type="text" placeholder="Enter Poll Code" value={pollCode} onChange={(e) => setPollCode(e.target.value)} />
      <button onClick={fetchPoll}>Fetch Poll</button>
      {poll && (
        <div>
          <h3>{poll.title}</h3>
          {poll.options.map((option) => (
            <button key={option.id} onClick={() => submitVote(option.id)}>
              {option.option_text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VotingPage;
