import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./stlyes.css"; // Import CSS file

const CreatePoll = () => {
const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [pollCode, setPollCode] = useState(null); // State to store poll code

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5010/create-poll", {
        title,
        options,
      });
      setPollCode(response.data.pollCode); // Store poll code in state
    } catch (error) {
      alert("Error creating poll.");
    }
  };

  return (
    <div className="create-poll-container">
      <h2>Create Poll</h2>
      <input type="text" placeholder="Poll Title" value={title} onChange={(e) => setTitle(e.target.value)} className="poll-input" />

      {options.map((option, index) => (
        <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="poll-input" />
      ))}

      <div className="buttons-container" style={{minWidth:'400px'}}>
        <button onClick={addOption} className="dashboard-button">➕ Add Option</button>
        <button onClick={handleSubmit} className="dashboard-button">✅ Create Poll</button>
        <button className="dashboard-button" onClick={() => navigate("/results")}>
          Live Results
        </button>
      </div>

      {/* Display the poll code after poll creation */}
      {pollCode && (
        <div className="poll-code-container">
          <p>📌 Poll Created! Use this code:</p>
          <h3 className="poll-code">{pollCode}</h3>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
