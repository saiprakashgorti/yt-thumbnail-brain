// src/components/ScoreCounter.jsx
import PropTypes from 'prop-types';
import React from 'react';
import './ScoreCounter.css';

const ScoreCounter = ({ score }) => {
  return (
    <div className="score-counter">
      <span className="score-label">Surveys Completed:</span>
      <span className="score-value">{score} / 5</span>
    </div>
  );
};

ScoreCounter.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreCounter;
