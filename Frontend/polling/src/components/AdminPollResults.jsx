import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5010");

const AdminPollResults = () => {
  const [pollCode, setPollCode] = useState("");
  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  // Fetch poll results from the backend
  const fetchPollResults = async () => {
    if (!pollCode) {
      setError("Please enter a poll code.");
      return;
    }
    setError("");

    try {
      const response = await fetch(`http://localhost:5010/poll-results/${pollCode}`);
      if (!response.ok) {
        throw new Error("Invalid poll code or poll not found.");
      }

      const data = await response.json();
      console.log("📊 API Response:", data); // Debugging log
      setPollTitle(data.pollTitle);
      setOptions(data.options);
    } catch (error) {
      console.error("❌ Failed to fetch poll results:", error);
      setError("Invalid poll code or poll not found.");
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Poll Results</h2>
      <input
        type="text"
        placeholder="Enter Poll Code"
        value={pollCode}
        onChange={(e) => setPollCode(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={fetchPollResults}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Results
      </button>
      {error && <p className="text-red-500">{error}</p>}

      {pollTitle && (
        <div className="mt-4 p-4 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold">{pollTitle}</h3>
          {options.length > 0 ? (
            <ul className="mt-2">
              {options.map((option) => (
                <li key={option.id} className="flex justify-between p-2 border-b">
                  <span>{option.option_text}</span>
                  <span className="font-bold">{option.vote_count} votes</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No votes yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPollResults;
