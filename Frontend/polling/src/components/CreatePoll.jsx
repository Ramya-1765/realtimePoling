import React, { useState } from "react";
import axios from "axios";

const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);

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
      alert(`Poll Created! Use code: ${response.data.pollCode}`);
    } catch (error) {
      alert("Error creating poll.");
    }
  };

  return (
    <div>
      <h2>Create Poll</h2>
      <input type="text" placeholder="Poll Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      {options.map((option, index) => (
        <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
      ))}
      <button onClick={addOption}>Add Option</button>
      <button onClick={handleSubmit}>Create Poll</button>
    </div>
  );
};

export default CreatePoll;
