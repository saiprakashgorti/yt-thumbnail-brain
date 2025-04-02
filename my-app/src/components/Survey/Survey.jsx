// src/components/Survey.jsx
import React, { useState } from 'react';
import './Survey.css';

const Survey = ({ onClose, onComplete, thumbnail, currentProgress, totalThumbnails = 10 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    initialImpression: '',
    attentionGrabbers: [],
    emotionalResponse: '',
    relevance: '',
    trustworthiness: '',
    clickMotivation: [],
    contentType: [],
    textEffectiveness: '',
    brandRecognition: '',
    shareLikelihood: [],
    improvementSuggestions: '',
    audienceTargeting: '',
    thumbnailStyle: [],
    engagementFactors: [],
    // New ML-specific fields
    visualElements: [],
    colorScheme: '',
    textElements: [],
    composition: '',
    technicalQuality: '',
    brandElements: [],
    emotionalTriggers: [],
    contentClarity: '',
    thumbnailMetrics: {
      clickProbability: 0,
      shareProbability: 0,
      watchTimeProbability: 0
    }
  });
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'initialImpression',
      question: "What's your first impression of this thumbnail?",
      type: 'text',
      placeholder: "Share what immediately catches your eye..."
    },
    {
      id: 'attentionGrabbers',
      question: "What elements make this thumbnail stand out?",
      type: 'multiselect',
      options: [
        'Bold Colors',
        'Clear Text',
        'Facial Expressions',
        'Contrast',
        'Professional Quality',
        'Unique Design'
      ]
    },
    {
      id: 'emotionalResponse',
      question: "How does this thumbnail make you feel?",
      type: 'select',
      options: [
        'Curious to learn more',
        'Excited to watch',
        'Trustworthy and reliable',
        'Skeptical',
        'Indifferent'
      ]
    },
    {
      id: 'relevance',
      question: "How well does this thumbnail represent the content you'd expect?",
      type: 'rating',
      max: 5
    },
    {
      id: 'trustworthiness',
      question: "How credible does this thumbnail appear?",
      type: 'rating',
      max: 5
    },
    {
      id: 'clickMotivation',
      question: "What would make you click on this thumbnail?",
      type: 'multiselect',
      options: [
        'Interesting Title',
        'Professional Design',
        'Clear Value Proposition',
        'Familiar Brand/Channel',
        'Engaging Visual Elements'
      ]
    },
    {
      id: 'contentType',
      question: "What type of content do you expect from this thumbnail?",
      type: 'multiselect',
      options: [
        'Educational/Tutorial',
        'Entertainment',
        'News/Information',
        'Product Review',
        'How-to Guide'
      ]
    },
    {
      id: 'textEffectiveness',
      question: "How effective is the text in this thumbnail?",
      type: 'select',
      options: [
        'Very Clear & Readable',
        'Somewhat Clear',
        'Too Small/Unreadable',
        'Too Much Text',
        'No Text Needed'
      ]
    },
    {
      id: 'brandRecognition',
      question: "Would you recognize this content creator's brand?",
      type: 'select',
      options: [
        'Yes, Very Familiar',
        'Somewhat Familiar',
        'Not Familiar',
        'No Brand Elements'
      ]
    },
    {
      id: 'shareLikelihood',
      question: "What would make you share this content?",
      type: 'multiselect',
      options: [
        'Valuable Information',
        'Entertaining Content',
        'Professional Quality',
        'Unique Perspective',
        'Relatable Topic'
      ]
    },
    {
      id: 'improvementSuggestions',
      question: "How could this thumbnail be improved?",
      type: 'text',
      placeholder: "Share your suggestions for making it more effective..."
    },
    {
      id: 'audienceTargeting',
      question: "Who do you think this thumbnail is designed for?",
      type: 'select',
      options: [
        'General Audience',
        'Specific Niche',
        'Professional/Expert',
        'Beginner/Novice',
        'Not Clear'
      ]
    },
    {
      id: 'thumbnailStyle',
      question: "What style of thumbnails do you prefer?",
      type: 'multiselect',
      options: [
        'Clean & Minimal',
        'Bold & Eye-catching',
        'Professional & Polished',
        'Casual & Authentic',
        'Educational & Clear'
      ]
    },
    {
      id: 'engagementFactors',
      question: "What elements increase your engagement with thumbnails?",
      type: 'multiselect',
      options: [
        'Clear Value Proposition',
        'Emotional Connection',
        'Professional Quality',
        'Unique Design',
        'Familiar Branding'
      ]
    },
    {
      id: 'visualElements',
      question: "What visual elements are present in this thumbnail?",
      type: 'multiselect',
      options: [
        'Faces/People',
        'Text Overlay',
        'Icons/Symbols',
        'Background Images',
        'Graphics/Illustrations',
        'Product Images',
        'Screenshots',
        'Infographics'
      ]
    },
    {
      id: 'colorScheme',
      question: "How would you describe the color scheme?",
      type: 'select',
      options: [
        'Warm & Vibrant',
        'Cool & Professional',
        'High Contrast',
        'Monochromatic',
        'Pastel & Soft',
        'Dark & Dramatic',
        'Bright & Bold'
      ]
    },
    {
      id: 'textElements',
      question: "What types of text elements are present?",
      type: 'multiselect',
      options: [
        'Title Text',
        'Subtitle/Description',
        'Numbers/Statistics',
        'Call-to-Action',
        'Channel Name',
        'Brand Name',
        'Emojis/Symbols'
      ]
    },
    {
      id: 'composition',
      question: "How would you describe the overall composition?",
      type: 'select',
      options: [
        'Balanced & Centered',
        'Dynamic & Diagonal',
        'Grid-Based',
        'Minimalist',
        'Busy & Detailed',
        'Rule of Thirds',
        'Asymmetrical'
      ]
    },
    {
      id: 'technicalQuality',
      question: "How would you rate the technical quality?",
      type: 'select',
      options: [
        'Professional & High-Res',
        'Good Quality',
        'Average',
        'Slightly Blurry',
        'Low Quality',
        'Over-Processed'
      ]
    },
    {
      id: 'brandElements',
      question: "What brand elements are present?",
      type: 'multiselect',
      options: [
        'Logo',
        'Brand Colors',
        'Channel Name',
        'Brand Typography',
        'Watermark',
        'Brand Icon',
        'None'
      ]
    },
    {
      id: 'emotionalTriggers',
      question: "What emotional triggers are present?",
      type: 'multiselect',
      options: [
        'Surprise/Shock',
        'Curiosity',
        'Humor',
        'Urgency',
        'FOMO',
        'Relatability',
        'Professional Authority'
      ]
    },
    {
      id: 'contentClarity',
      question: "How clear is the content message?",
      type: 'select',
      options: [
        'Very Clear & Direct',
        'Clear with Some Mystery',
        'Somewhat Ambiguous',
        'Unclear Purpose',
        'Misleading',
        'Too Complex'
      ]
    },
    {
      id: 'thumbnailMetrics',
      question: "Rate the likelihood of different actions (1-5):",
      type: 'metrics',
      options: [
        {
          id: 'clickProbability',
          label: 'Clicking on the video',
          description: 'How likely are you to click on this thumbnail?'
        },
        {
          id: 'shareProbability',
          label: 'Sharing the content',
          description: 'How likely are you to share this content?'
        },
        {
          id: 'watchTimeProbability',
          label: 'Watching the full video',
          description: 'How likely are you to watch the full video?'
        }
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Save answers to Firestore
      // await addDoc(collection(db, "user_study"), {
      //   thumbnailId: thumbnail.id,
      //   timestamp: new Date().toISOString(),
      //   ...answers
      // });

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
      }, 2000);
    } catch (error) {
      console.error("Error adding document: ", error);
      // Still call onComplete even if there's an error
      onComplete(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMetrics = (options) => {
    return (
      <div className="survey-metrics">
        {options.map(option => (
          <div key={option.id} className="metric-item">
            <div className="metric-label">{option.label}</div>
            <div className="metric-description">{option.description}</div>
            <div className="metric-rating">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  className={`rating-button ${answers.thumbnailMetrics[option.id] === value ? 'selected' : ''}`}
                  onClick={() => handleMetricAnswer(option.id, value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleMetricAnswer = (metricId, value) => {
    setAnswers(prev => ({
      ...prev,
      thumbnailMetrics: {
        ...prev.thumbnailMetrics,
        [metricId]: value
      }
    }));
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
      case 'metrics':
        return renderMetrics(currentQ.options);
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
