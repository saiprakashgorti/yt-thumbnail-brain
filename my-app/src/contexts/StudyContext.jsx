import React, { createContext, useContext, useState } from 'react';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
    const [responses, setResponses] = useState([]);
    const [currentThumbnail, setCurrentThumbnail] = useState(null);

    const addResponse = (response) => {
        setResponses(prev => [...prev, {
            ...response,
            timestamp: new Date().toISOString()
        }]);
    };

    return (
        <StudyContext.Provider value={{ responses, addResponse, currentThumbnail, setCurrentThumbnail }}>
            {children}
        </StudyContext.Provider>
    );
};

export const useStudy = () => useContext(StudyContext);