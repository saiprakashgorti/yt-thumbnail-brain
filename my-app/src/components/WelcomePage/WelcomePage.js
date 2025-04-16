import React from "react";
import "./WelcomePage.css";

const WelcomePage = ({ onStart, name, handleNameChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      handleNameChange(name.trim());
      onStart();
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Thumbnail Brain</h1>
        <p className="welcome-subtitle">Analyze YouTube thumbnails with AI</p>

        <div className="welcome-rules">
          <h2>How it works:</h2>
          <ol>
            <li>You'll see 4 YouTube thumbnails at a time</li>
            <li>Click on any thumbnail that catches your attention</li>
            <li>Rate the thumbnail based on its effectiveness</li>
            <li>Complete 5 thumbnails to finish the study</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="welcome-form">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your name to begin"
            className="welcome-input"
            required
          />
          <button type="submit" className="welcome-button">
            Start Study
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;
