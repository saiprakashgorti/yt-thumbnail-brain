// src/components/Survey.jsx
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase/db';
import './Survey.css';

const Survey = ({ onClose, onComplete, name, thumbnail, currentProgress, totalThumbnails = 5 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    firstImpression: '',
    colorImpact: '',
    designElements: '',
    faceImpact: '',
    titleMatch: '',
  });
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'firstImpression',
      question: "What first caught your eye about the thumbnail you chose?",
      type: 'text',
      placeholder: "Describe what initially drew your attention..."
    },
    {
      id: 'colorImpact',
      question: "How did the colors or overall color tone affect your decision?",
      type: 'text',
      placeholder: "Explain how the colors influenced your choice..."
    },
    {
      id: 'designElements',
      question: "What text features (like fonts, size, or style) or design elements (like shapes, icons, or layouts) stood out most to you in the thumbnail?",
      type: 'text',
      placeholder: "Describe the text and design elements that caught your attention..."
    },
    {
      id: 'faceImpact',
      question: "Did you notice any faces on the thumbnail? If so, how did that affect your choice? If no faces were present, did that influence how you felt about it?",
      type: 'text',
      placeholder: "Share your thoughts about the presence or absence of faces..."
    },
    {
      id: 'titleMatch',
      question: "In your opinion, how well did the thumbnail's image match or support the video title?",
      type: 'text',
      placeholder: "Explain how well the thumbnail and title worked together..."
    }
  ];

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "user_study"), {
        name,
        thumbnailId: thumbnail.id,
        timestamp: new Date().toISOString(),
        ...answers
      });

      // Show reward message based on progress
      const newProgress = currentProgress + 1;
      if (newProgress === totalThumbnails) {
        setRewardMessage("🎉 Congratulations! You've completed all thumbnails!");
      } else if (newProgress % 5 === 0) {
        setRewardMessage("🌟 Great job! You're making excellent progress!");
      } else {
        setRewardMessage("✨ Keep going! You're doing great!");
      }
      setShowReward(true);

      // Wait for reward animation before completing
      setTimeout(() => {
        onComplete(answers);
        window.location.reload(); // Reload the page to show new images
      }, 2000);
    } catch (error) {
      console.error("Error adding document: ", error);
      // Still call onComplete even if there's an error
      onComplete(answers);
      window.location.reload(); // Reload the page even if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const currentQ = questions[currentStep];

    switch (currentQ.type) {
      case 'text':
        return (
          <textarea
            value={answers[currentQ.id]}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={currentQ.placeholder}
            className="survey-input"
          />
        );
      case 'multiselect':
        return (
          <div className="survey-options">
            {currentQ.options.map(option => (
              <label key={option} className="survey-option">
                <input
                  type="checkbox"
                  checked={answers[currentQ.id].includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...answers[currentQ.id], option]
                      : answers[currentQ.id].filter(item => item !== option);
                    handleAnswer(newValue);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <div className="survey-options">
            {currentQ.options.map(option => (
              <label key={option} className="survey-option">
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option}
                  checked={answers[currentQ.id] === option}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="survey-rating">
            {[...Array(currentQ.max)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`rating-button ${answers[currentQ.id] === i + 1 ? 'selected' : ''}`}
                onClick={() => handleAnswer(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const isCurrentQuestionAnswered = () => {
    const currentQ = questions[currentStep];
    const answer = answers[currentQ.id];

    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== '';
  };

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="survey-layout">
          <div className="survey-thumbnail-container">
            <div className="progress-indicator">
              <div className="progress-circle">
                <span className="progress-number">{currentProgress + 1}</span>
                <span className="progress-label">of {totalThumbnails}</span>
              </div>
            </div>
            <img
              src={`/thumbnails/${thumbnail.thumbnailFile}`}
              alt="Selected thumbnail"
              className="survey-thumbnail"
            />
            <div className="thumbnail-metadata">
              <h3 className="metadata-title">{thumbnail.title}</h3>
              <div className="metadata-channel">{thumbnail.uploader}</div>
              <div className="metadata-views">
                {thumbnail.views ? `${new Intl.NumberFormat('en-US', { notation: 'compact' }).format(thumbnail.views)} views` : ''}
              </div>
            </div>
          </div>
          <div className="survey-content">
            <div className="survey-progress">
              <div
                className="progress-bar"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <h2>{questions[currentStep].question}</h2>
            {renderQuestion()}
            <div className="survey-navigation">
              {currentStep > 0 && (
                <button
                  className="nav-button back"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
              <button
                className="nav-button next"
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered() || isSubmitting}
              >
                {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showReward && (
        <div className="reward-overlay">
          <div className="reward-content">
            <div className="reward-icon">✨</div>
            <h3 className="reward-message">{rewardMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Survey;
