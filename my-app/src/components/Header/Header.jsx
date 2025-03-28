// components/Header/Header.jsx
import React from 'react';
import Progress from '../Progress/Progress'; // Import the new Progress component
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
                <h1 className="header-title">YouTube Thumbnail Analyzer</h1>
                <Progress score={score} /> {/* Add the Progress component */}
            </div>
        </header>
    );
};

export default Header;