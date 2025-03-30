import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [points, setPoints] = useState(() => {
        const savedPoints = localStorage.getItem('gamePoints');
        return savedPoints ? parseInt(savedPoints) : 0;
    });

    const [level, setLevel] = useState(() => {
        const savedLevel = localStorage.getItem('gameLevel');
        return savedLevel ? parseInt(savedLevel) : 1;
    });

    const [streak, setStreak] = useState(() => {
        const savedStreak = localStorage.getItem('gameStreak');
        return savedStreak ? parseInt(savedStreak) : 0;
    });

    // Points needed for each level (increases exponentially)
    const pointsForNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));

    // Calculate progress to next level
    const progress = (points / pointsForNextLevel) * 100;

    const addPoints = (amount) => {
        const newPoints = points + amount;
        setPoints(newPoints);
        localStorage.setItem('gamePoints', newPoints);

        // Check for level up
        if (newPoints >= pointsForNextLevel) {
            const newLevel = level + 1;
            setLevel(newLevel);
            localStorage.setItem('gameLevel', newLevel);
        }
    };

    const incrementStreak = () => {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('gameStreak', newStreak);
    };

    const resetStreak = () => {
        setStreak(0);
        localStorage.setItem('gameStreak', 0);
    };

    return (
        <GameContext.Provider value={{
            points,
            level,
            streak,
            progress,
            pointsForNextLevel,
            addPoints,
            incrementStreak,
            resetStreak
        }}>
            {children}
        </GameContext.Provider>
    );
}; 