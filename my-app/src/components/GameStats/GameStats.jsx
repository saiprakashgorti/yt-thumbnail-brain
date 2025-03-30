import React from 'react';
import { useGame } from '../../contexts/GameContext';
import './GameStats.css';

const GameStats = () => {
    const { points, level, streak, progress } = useGame();

    return (
        <div className="game-stats">
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-value">{level}</span>
                    <span className="stat-label">Level</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{points}</span>
                    <span className="stat-label">Points</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">🔥 {streak}</span>
                    <span className="stat-label">Streak</span>
                </div>
            </div>
            <div className="level-progress">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default GameStats; 