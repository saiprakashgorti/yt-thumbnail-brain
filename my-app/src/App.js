import React, { useEffect, useState } from 'react';
import './App.css';
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
  const [surveyCount, setSurveyCount] = useState(() => {
    const savedCount = localStorage.getItem('surveyCount');
    return savedCount ? parseInt(savedCount) : 0;
  });

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

    // Update survey count

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

  // Calculate progress percentage
  const progressPercentage = (surveyCount / 10) * 100;

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">Thumbnail Brain</h1>
          <p className="app-subtitle">Analyze YouTube thumbnails with AI</p>
        </div>
      </div>

      <main className="main-content">
        <div className="thumbnail-grid-container">
          <ThumbnailGrid
            data={currentThumbnails}
            isLoading={false}
            onThumbnailClick={handleThumbnailClick}
          />

          {currentThumbnails.length === 0 && (
            <PlayAgainButton onClick={handlePlayAgain} />
          )}
        </div>
      </main>

      {showSurvey && (
        <Survey
          onClose={() => setShowSurvey(false)}
          onComplete={handleSurveyComplete}
          thumbnail={selectedThumbnail}
        />
      )}
    </div>
  );
}

export default App;
