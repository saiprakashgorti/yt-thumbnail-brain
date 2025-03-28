import React from 'react';
import './Progress.css';

const Progress = ({ score }) => {
    return (
        <div className="score-progress">
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            <span className="progress-text">{score}%</span>
        </div>
    );
};

export default Progress;
