import React, { useState } from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onStart }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem('userName', name.trim());
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
                        <li>Help us understand what makes thumbnails engaging</li>
                    </ol>
                </div>

                <form onSubmit={handleSubmit} className="welcome-form">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="welcome-input"
                        required
                    />
                    <button type="submit" className="apple-button">
                        Let's Play
                        <svg className="apple-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                            <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomePage; 