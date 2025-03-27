// components/Header/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ onClose, showClose }) => {
    return (
        <header className="app-header">
            <div className="header-content">
                <h1>Thumbnail Analyzer</h1>
                {showClose && (
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close metadata panel"
                    >
                        &times;
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;