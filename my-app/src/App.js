import React, { useEffect, useState } from 'react';
import './App.css';
import PlayAgainButton from './components/PlayAgainButton/PlayAgainButton';
import Survey from './components/Survey/Survey';
import ThumbnailGrid from './components/ThumbnailGrid/ThumbnailGrid';
import WelcomePage from './components/WelcomePage/WelcomePage';
import { useStudy } from './contexts/StudyContext';

function App() {
  const [thumbnailData, setThumbnailData] = useState([]);
  const [currentThumbnails, setCurrentThumbnails] = useState([]);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('userName');
  });
  const { responses, addResponse, setCurrentThumbnail } = useStudy();
  const [surveyCount, setSurveyCount] = useState(() => {
    const savedCount = localStorage.getItem('surveyCount');
    return savedCount ? parseInt(savedCount) : 0;
  });
  const [showCompletion, setShowCompletion] = useState(false);

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

  const handleSurveyComplete = (answers) => {
    addResponse({ thumbnail: selectedThumbnail, ...answers });
    setShowSurvey(false);
    setSelectedThumbnail(null);

    // Update survey count
    const newCount = surveyCount + 1;
    setSurveyCount(newCount);
    localStorage.setItem('surveyCount', newCount.toString());

    // If we've reached 10 surveys, show completion message
    if (newCount >= 10) {
      setShowCompletion(true);
      return;
    }

    // Remove the selected thumbnail and add a new one to maintain 4 thumbnails
    const updatedThumbnails = currentThumbnails.filter(t => t !== selectedThumbnail);

    // Get a new thumbnail that's not already in the current set
    const availableThumbnails = thumbnailData.filter(t =>
      !updatedThumbnails.some(existing => existing.id === t.id)
    );

    if (availableThumbnails.length > 0) {
      const newThumbnail = availableThumbnails[Math.floor(Math.random() * availableThumbnails.length)];
      setCurrentThumbnails([...updatedThumbnails, newThumbnail]);
    } else {
      // If we've run out of thumbnails, shuffle and get new ones
      shuffleAndSetThumbnails(thumbnailData);
    }
  };

  const handlePlayAgain = () => {
    setSurveyCount(0);
    setShowCompletion(false);
    localStorage.setItem('surveyCount', '0');
    shuffleAndSetThumbnails(thumbnailData);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // Calculate progress percentage
  const progressPercentage = (surveyCount / 10) * 100;

  if (showWelcome) {
    return <WelcomePage onStart={handleWelcomeComplete} />;
  }

  if (showCompletion) {
    return (
      <div className="completion-overlay">
        <div className="completion-content">
          <div className="completion-icon">🎉</div>
          <h2 className="completion-title">Congratulations!</h2>
          <p className="completion-message">You've completed all 10 thumbnails. Thank you for your contribution!</p>
          <PlayAgainButton onClick={handlePlayAgain} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">Thumbnail Brain</h1>
          <p className="app-subtitle">Analyze YouTube thumbnails with AI</p>
        </div>
        <div className="header-right">
          <div className="surveys-completed">
            <div className="surveys-progress">
              <div className="surveys-progress-circle"></div>
              <div
                className="surveys-progress-fill"
                style={{ '--progress': `${(surveyCount / 10) * 100}%` }}
              ></div>
              <div className="surveys-progress-text">{surveyCount}</div>
            </div>
            <div className="surveys-label">Surveys Completed</div>
          </div>
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
          currentProgress={surveyCount}
          totalThumbnails={10}
        />
      )}
    </div>
  );
}

export default App;
