import React, { createContext, useContext, useState, useEffect } from 'react';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
    const [responses, setResponses] = useState(() => {
        const savedResponses = sessionStorage.getItem("studyResponses");
        return savedResponses ? JSON.parse(savedResponses) : [];
    });
    const [currentThumbnail, setCurrentThumbnail] = useState(() => {
        const savedThumbnail = sessionStorage.getItem("studyCurrentThumbnail");
        return savedThumbnail ? JSON.parse(savedThumbnail) : null;
    });

    // Persist responses and currentThumbnail to sessionStorage
    useEffect(() => {
        sessionStorage.setItem("studyResponses", JSON.stringify(responses));
    }, [responses]);

    useEffect(() => {
        sessionStorage.setItem("studyCurrentThumbnail", JSON.stringify(currentThumbnail));
    }, [currentThumbnail]);

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