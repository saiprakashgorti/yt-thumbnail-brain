import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header'; // Updated import
import MetadataPanel from './components/MetadataPanel/MetadataPanel';
import PlayAgainButton from './components/PlayAgainButton/PlayAgainButton';
import Survey from './components/Survey/Survey';
import ThumbnailGrid from './components/ThumbnailGrid/ThumbnailGrid';
import { useStudy } from './contexts/StudyContext';

function App() {
  const [thumbnailData, setThumbnailData] = useState([]);
  const [currentThumbnails, setCurrentThumbnails] = useState([]);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const { responses, addResponse, setCurrentThumbnail } = useStudy();

  useEffect(() => {
    const data = require('./assets/data/processed-metadata.json');
    setThumbnailData(data);
    shuffleAndSetThumbnails(data);
  }, []);

  const shuffleAndSetThumbnails = (data) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setCurrentThumbnails(shuffled.slice(0, 4));
  };

  const handleThumbnailClick = (thumbnail) => {
    setCurrentThumbnail(thumbnail);
    setSelectedThumbnail(thumbnail);
    setShowSurvey(true);
  };

  const handleSurveyComplete = (rating) => {
    addResponse({ thumbnail: selectedThumbnail, rating });
    setShowSurvey(false);
    setSelectedThumbnail(null);

    const updatedThumbnails = currentThumbnails.filter(t => t !== selectedThumbnail);
    if (updatedThumbnails.length > 0) {
      setCurrentThumbnails(updatedThumbnails);
    } else {
      shuffleAndSetThumbnails(thumbnailData);
    }
  };

  const handlePlayAgain = () => {
    shuffleAndSetThumbnails(thumbnailData);
  };

  return (
    <div className="app-container dark-theme">
      <Header showClose={false} /> {/* Replaced header with Header component */}

      <ThumbnailGrid
        data={currentThumbnails}
        isLoading={false}
        onThumbnailClick={handleThumbnailClick}
      />

      {currentThumbnails.length === 0 && (
        <PlayAgainButton onClick={handlePlayAgain} />
      )}

      {showSurvey && (
        <Survey
          onClose={() => setShowSurvey(false)}
          onComplete={handleSurveyComplete}
          thumbnail={selectedThumbnail}
        />
      )}

      <MetadataPanel metadata={selectedThumbnail} />
    </div>
  );
}

export default App;
