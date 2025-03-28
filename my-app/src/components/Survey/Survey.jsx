// src/components/Survey.jsx
import React, { useEffect, useState } from 'react';
import './Survey.css';

const Survey = ({ onClose, onComplete, thumbnail }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    initialImpression: '',
    attentionGrabbers: [],
    emotionalResponse: '',
    relevance: '',
    trustworthiness: '',
    additionalFactors: []
  });

  // Get current count from localStorage or initialize to 0
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem('surveyCount');
    return savedCount ? parseInt(savedCount) : 0;
  });

  // Update localStorage when count changes
  useEffect(() => {
    localStorage.setItem('surveyCount', count.toString());
  }, [count]);

  const questions = [
    {
      id: 'initialImpression',
      question: "What was your first impression when you saw this thumbnail?",
      type: 'text',
      placeholder: "e.g., Professional, engaging, mysterious..."
    },
    {
      id: 'attentionGrabbers',
      question: "What elements caught your attention first?",
      type: 'multiselect',
      options: [
        'Title text',
        'Thumbnail image',
        'Channel name',
        'View count',
        'Duration',
        'Upload date'
      ]
    },
    {
      id: 'emotionalResponse',
      question: "How did this thumbnail make you feel?",
      type: 'select',
      options: [
        'Curious',
        'Excited',
        'Skeptical',
        'Neutral',
        'Other'
      ]
    },
    {
      id: 'relevance',
      question: "How relevant did you find this content to your interests?",
      type: 'rating',
      max: 5
    },
    {
      id: 'trustworthiness',
      question: "How trustworthy did you find this thumbnail?",
      type: 'rating',
      max: 5
    },
    {
      id: 'additionalFactors',
      question: "What other factors influenced your decision to click?",
      type: 'multiselect',
      options: [
        'Thumbnail quality',
        'Professional appearance',
        'Clickbait potential',
        'Content clarity',
        'Brand recognition',
        'Social proof (views/likes)'
      ]
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

  const handleSubmit = () => {
    // Save answers to localStorage
    const savedAnswers = JSON.parse(localStorage.getItem('surveyAnswers') || '[]');
    savedAnswers.push({
      thumbnailId: thumbnail.id,
      timestamp: new Date().toISOString(),
      ...answers
    });
    localStorage.setItem('surveyAnswers', JSON.stringify(savedAnswers));

    // Increment counter
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('surveyCount', newCount.toString());

    // Call the onComplete callback with the answers
    onComplete(answers);

    // If we've reached 10 submissions, show completion message
    if (newCount >= 10) {
      alert('Thank you for completing all 10 surveys!');
    }

    // Refresh the page
    window.location.reload();
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

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="survey-content">
          <div className="survey-progress">
            <div
              className="progress-bar"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="survey-counter">
            Survey {count + 1} of 10
          </div>
          <h2>{questions[currentStep].question}</h2>
          {renderQuestion()}
          <div className="survey-navigation">
            {currentStep > 0 && (
              <button className="nav-button back" onClick={handleBack}>
                Back
              </button>
            )}
            <button
              className="nav-button next"
              onClick={handleNext}
              disabled={!answers[questions[currentStep].id] ||
                (Array.isArray(answers[questions[currentStep].id]) &&
                  answers[questions[currentStep].id].length === 0)}
            >
              {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
