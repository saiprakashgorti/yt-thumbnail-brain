// src/components/Survey.jsx
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from 'react';
import { db } from '../../firebase/db';
import './Survey.css';

const Survey = ({
  onClose,
  onComplete,
  name,
  thumbnail,
  currentProgress,
  totalThumbnails = 5,
  shownThumbnails // <-- Pass this prop: array of 4 thumbnail objects shown to the user
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'colorFeatures',
      question: "Which color-related feature influenced your choice?",
      type: 'checkbox',
      options: [
        { label: "Bright Colors & High Contrast", explanation: "Vibrant hues with strong light-versus-dark contrast" },
        { label: "Color Tone & Gradients", explanation: "Smooth blends or shifts between colors" },
        { label: "Colour Contrast", explanation: "Use of complementary or opposing colors" },
        { label: "None of these", explanation: "No color aspect affected my decision" },
        { label: "Other", explanation: "A different color-related feature" }
      ]
    },
    {
      id: 'textGraphicFeatures',
      question: "Which text or graphic element influenced your choice?",
      type: 'checkbox',
      options: [
        { label: "Overlaid Text & Graphic Elements", explanation: "Words or icons laid over the image" },
        { label: "Typography & Font Style", explanation: "Distinct font or lettering style" },
        { label: "Title – Phrases or Number", explanation: "Catchy words or numbers or short phrases" },
        { label: "Branding & Logo Cues", explanation: "Channel or company logo for credibility" },
        { label: "None of these", explanation: "No text/graphic feature mattered" },
        { label: "Other", explanation: "A different text/graphic feature" }
      ]
    },
    {
      id: 'faceFeatures',
      question: "Which face-related feature influenced your choice?",
      type: 'checkbox',
      options: [
        { label: "Recognizable Faces & Familiarity", explanation: "A known person you recognized" },
        { label: "Trustworthiness & Persona", explanation: "Person’s look seemed credible or likable" },
        { label: "Human Expressions", explanation: "Emotional facial expressions shown" },
        { label: "No faces present", explanation: "No faces were included at all" },
        { label: "Other", explanation: "A different face-related aspect" }
      ]
    },
    {
      id: 'compositionFeatures',
      question: "Which compositional or contextual cue influenced your choice?",
      type: 'checkbox',
      options: [
        { label: "Composition & Layout", explanation: "Arrangement and balance of elements" },
        { label: "Mystery & Suspense Cues", explanation: "Hidden or blurred parts creating intrigue" },
        { label: "Incomplete Info Presence", explanation: "Partial visuals that raise questions" },
        { label: "Thematic/Subject-Matter Indicators", explanation: "Visual hints about the video topic" },
        { label: "None of these", explanation: "No layout or context cue mattered" },
        { label: "Other", explanation: "A different compositional feature" }
      ]
    },
    {
      id: 'overallMatch',
      question: "Overall, how well did the thumbnail support the video title/content?",
      type: 'radio',
      options: [
        { label: "Very well", explanation: "Thumbnail clearly matches the title" },
        { label: "Somewhat", explanation: "Thumbnail partly reflects the content" },
        { label: "Not at all", explanation: "Thumbnail doesn’t reflect the content" },
        { label: "Other", explanation: "A different level of match" }
      ]
    }
  ];

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }));
  };

  const handleOtherTextChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${questionId}_other`]: value
    }));
  };

  const renderQuestion = () => {
    const currentQ = questions[currentStep];
    if (currentQ.type === 'checkbox') {
      const selected = Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : [];
      return (
        <div className="survey-options">
          {currentQ.options.map(option => (
            <React.Fragment key={option.label}>
              <label className="survey-option">
                <input
                  type="checkbox"
                  name={currentQ.id}
                  value={option.label}
                  checked={selected.includes(option.label)}
                  onChange={e => {
                    let newValue;
                    if (e.target.checked) {
                      newValue = [...selected, option.label];
                    } else {
                      newValue = selected.filter(l => l !== option.label);
                    }
                    handleAnswer(newValue);
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="option-label">{option.label}</span>
                  <span className="option-explanation" style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 400 }}>{option.explanation}</span>
                </div>
              </label>
              {option.label === "Other" && selected.includes("Other") && (
                <textarea
                  className="survey-input"
                  placeholder="Please specify..."
                  value={answers[`${currentQ.id}_other`] || ""}
                  onChange={e => handleOtherTextChange(currentQ.id, e.target.value)}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
    if (currentQ.type === 'radio') {
      return (
        <div className="survey-options">
          {currentQ.options.map(option => (
            <React.Fragment key={option.label}>
              <label className="survey-option">
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option.label}
                  checked={answers[currentQ.id] === option.label}
                  onChange={() => handleAnswer(option.label)}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="option-label">{option.label}</span>
                  <span className="option-explanation" style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 400 }}>{option.explanation}</span>
                </div>
              </label>
              {option.label === "Other" && answers[currentQ.id] === "Other" && (
                <textarea
                  className="survey-input"
                  placeholder="Please specify..."
                  value={answers[`${currentQ.id}_other`] || ""}
                  onChange={e => handleOtherTextChange(currentQ.id, e.target.value)}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
    return null;
  };

  const isCurrentQuestionAnswered = () => {
    const currentQ = questions[currentStep];
    const answer = answers[currentQ.id];
    if (currentQ.type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (currentQ.type === 'radio') {
      return !!answer;
    }
    return false;
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
      // Build submission object with only relevant answers
      const submission = {
        name,
        thumbnailId: thumbnail.id,
        timestamp: new Date().toISOString(),
      };
      questions.forEach(q => {
        let answer = answers[q.id];
        // If "Other" is selected and text is present, replace/add "Other - <text>"
        if (q.type === "checkbox" && Array.isArray(answer)) {
          const idx = answer.indexOf("Other");
          if (idx !== -1 && answers[`${q.id}_other`]) {
            answer = [
              ...answer.slice(0, idx),
              `Other - ${answers[`${q.id}_other`]}`,
              ...answer.slice(idx + 1)
            ];
          }
          submission[q.id] = answer;
        } else if (q.type === "radio") {
          if (answer === "Other" && answers[`${q.id}_other`]) {
            submission[q.id] = `Other - ${answers[`${q.id}_other`]}`;
          } else if (answer !== undefined) {
            submission[q.id] = answer;
          }
        }
      });

      // shownThumbnails is now an array of thumbnailFile strings
      if (shownThumbnails && Array.isArray(shownThumbnails)) {
        submission.shownThumbnails = shownThumbnails;
      }

      await addDoc(collection(db, "crowdsourcing"), submission);

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
