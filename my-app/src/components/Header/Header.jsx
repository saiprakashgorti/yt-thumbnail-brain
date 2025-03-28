// components/Header/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ onClose, showClose, score }) => {
    return (
        <header className="app-header">
            <div className="header-content">
                <h1 className="app-title">Thumbnail Brain</h1>
                <p className="app-subtitle">Analyze YouTube thumbnails with AI</p>
            </div>

            <div className="header-right">
                <div className="surveys-completed">
                    <span>Surveys Completed:</span>
                    {score} / 10
                </div>
                {showClose && (
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close metadata panel"
                    >
                        ×
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;