// components/Header/Header.jsx
import React from 'react';
import ScoreCounter from '../ScoreCounter/ScoreCoutner';
import './Header.css';

const Header = ({ onClose, showClose, score }) => {
    return (
        <header className="app-header">
            <div className="header-content">
                {showClose && (
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close metadata panel"
                    >
                        &times;
                    </button>
                )}
                <div className="header-left">
                    <h1 className="header-title">Thumbnail Brain</h1>
                    <p className="header-subtitle">Analyze YouTube thumbnails with AI</p>
                </div>
                <div className="header-right">
                    <ScoreCounter score={score || 0} />
                </div>
            </div>
        </header>
    );
};

export default Header;