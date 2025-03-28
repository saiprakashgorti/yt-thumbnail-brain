// src/components/Survey.jsx
import React, { useState } from 'react';
import firebaseConfig from '../../firebase/config';
import { db } from "../../firebase/db";
import { collection, addDoc } from "firebase/firestore";
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

  const questions = [
    {
      id: 'initialImpression',
      question: "What caught your eye first?",
      type: 'text',
      placeholder: "Share your first impression..."
    },
    {
      id: 'attentionGrabbers',
      question: "Select the elements that stood out",
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
      question: "How did this make you feel?",
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
      question: "Rate the relevance to your interests",
      type: 'rating',
      max: 5
    },
    {
      id: 'trustworthiness',
      question: "How trustworthy does this appear?",
      type: 'rating',
      max: 5
    },
    {
      id: 'additionalFactors',
      question: "What influenced your decision?",
      type: 'multiselect',
      options: [
        'Quality',
        'Professional look',
        'Clickbait potential',
        'Clear content',
        'Brand recognition',
        'Social proof'
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

  const handleSubmit = async () => {
    // Save answers to Firestore
    console.log('Storing answers to Firestore');
    console.log(firebaseConfig);
    try {
      await addDoc(collection(db, "user_study"), {
        thumbnailId: thumbnail.id,
        timestamp: new Date().toISOString(),
        ...answers
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    
    // Call the onComplete callback with the answers
    onComplete(answers);
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
        <div className="survey-layout">
          <div className="survey-thumbnail-container">
            <img
              src={`/thumbnails/${thumbnail.thumbnailFile}`}
              alt="Selected thumbnail"
              className="survey-thumbnail"
            />
            <div className="thumbnail-metadata">
              <h3 className="metadata-title">{thumbnail.title}</h3>
              <div className="metadata-channel">{thumbnail.channelTitle}</div>
              <div className="metadata-views">
                {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(thumbnail.viewCount)} views
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
    </div>
  );
};

export default Survey;
