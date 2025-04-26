import React, { useEffect, useState } from "react";
import "./App.css";
import PlayAgainButton from "./components/PlayAgainButton/PlayAgainButton";
import Survey from "./components/Survey/Survey";
import ThumbnailGrid from "./components/ThumbnailGrid/ThumbnailGrid";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import { useStudy } from "./contexts/StudyContext";

function App() {
  const [thumbnailData, setThumbnailData] = useState([]);
  const [faceThumbnails, setFaceThumbnails] = useState([]);
  const [nonFaceThumbnails, setNonFaceThumbnails] = useState([]);
  const [currentThumbnails, setCurrentThumbnails] = useState([]);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("userName");
  });
  const { responses, addResponse, setCurrentThumbnail } = useStudy();
  const [surveyCount, setSurveyCount] = useState(() => {
    const savedCount = localStorage.getItem("surveyCount");
    return savedCount ? parseInt(savedCount) : 0;
  });
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const regularData = require("./assets/data/processed-metadata.json");
    const faceData = require("./assets/data/face_metadata.json");
    const nonFaceData = require("./assets/data/non-face_metadata.json");

    setThumbnailData(regularData);
    setFaceThumbnails(faceData);
    setNonFaceThumbnails(nonFaceData);

    // Pass surveyCount to properly initialize thumbnails
    shuffleAndSetThumbnails(faceData, nonFaceData, surveyCount);
  }, [surveyCount]);

  const shuffleAndSetThumbnails = (faceData, nonFaceData, count) => {
    // For first 3 surveys: 3 face thumbnails + 1 non-face thumbnail
    // After 3 surveys: all 4 non-face thumbnails
    let selectedThumbnails = [];

    if (count < 3) {
      // Shuffle face thumbnails and take 3
      const shuffledFace = [...faceData].sort(() => 0.5 - Math.random());
      const facePicks = shuffledFace.slice(0, 3);

      // Shuffle non-face thumbnails and take 1
      const shuffledNonFace = [...nonFaceData].sort(() => 0.5 - Math.random());
      const nonFacePick = shuffledNonFace.slice(0, 1);

      // Combine and shuffle again for random positioning
      selectedThumbnails = [...facePicks, ...nonFacePick].sort(() => 0.5 - Math.random());
    } else {
      // After 3 surveys, only show non-face thumbnails
      const shuffledNonFace = [...nonFaceData].sort(() => 0.5 - Math.random());
      selectedThumbnails = shuffledNonFace.slice(0, 4);
    }

    setCurrentThumbnails(selectedThumbnails);
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
    localStorage.setItem("surveyCount", newCount.toString());

    // If we've reached 6 surveys, show completion message
    if (newCount >= 6) {
      setShowCompletion(true);
      return;
    }

    // Use the updated survey count to determine which thumbnails to show
    shuffleAndSetThumbnails(faceThumbnails, nonFaceThumbnails, newCount);
  };

  const handlePlayAgain = () => {
    setSurveyCount(0);
    setShowCompletion(false);
    setShowWelcome(true); // Show welcome page again
    localStorage.setItem("surveyCount", "0");
    // shuffleAndSetThumbnails(faceThumbnails, nonFaceThumbnails, 0); // No need, will be set after welcome
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleNameChange = (name) => {
    localStorage.setItem("userName", name);
    setName(name);
  };

  // Calculate progress percentage
  const progressPercentage = (surveyCount / 6) * 100;

  if (showWelcome) {
    return (
      <WelcomePage
        onStart={handleWelcomeComplete}
        name={name}
        handleNameChange={handleNameChange}
      />
    );
  }

  if (showCompletion) {
    return (
      <div className="completion-overlay">
        <div className="completion-content">
          <div className="completion-icon">🎉</div>
          <h2 className="completion-title">Congratulations!</h2>
          <p className="completion-message">
            You've completed all 6 thumbnails. Thank you for your contribution!
          </p>
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
                style={{ "--progress": `${(surveyCount / 6) * 100}%` }}
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
          name={name}
          thumbnail={selectedThumbnail}
          currentProgress={surveyCount}
          totalThumbnails={6}
          shownThumbnails={currentThumbnails.map(t => t.id)}
        />
      )}
    </div>
  );
}

export default App;
