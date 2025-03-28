// src/components/PlayAgainButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './PlayAgainButton.css';

const PlayAgainButton = ({ onClick }) => {
  return (
    <button className="play-again-button" onClick={onClick}>
      Play Again
    </button>
  );
};

PlayAgainButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PlayAgainButton;
