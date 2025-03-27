// components/ThumbnailCard/ThumbnailCard.jsx
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import { useStudy } from '../../contexts/StudyContext';
import './ThumbnailCard.css';

// Helper functions moved before component
const formatViews = (views) => {
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K`;
  return views.toLocaleString();
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ThumbnailCard = ({ metadata }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setCurrentThumbnail } = useStudy();

  const handleClick = () => {
    setCurrentThumbnail(metadata);
  };

  const handleImageError = (e) => {
    e.target.src = '/fallback-thumbnail.jpg';
  };

  return (
    <article className="thumbnail-card" onClick={handleClick}>
      <div className="thumbnail-image-container">
        <LazyLoadImage
          src={`/thumbnails/${metadata.thumbnailFile}`}
          alt={`Thumbnail for "${metadata.title}"`}
          className={`thumbnail-image ${isLoaded ? 'loaded' : ''}`}
          effect="opacity"
          placeholder={
            <div
              className="image-placeholder"
              style={{ backgroundColor: '#f0f0f0' }}
            />
          }
          afterLoad={() => setIsLoaded(true)}
          onError={handleImageError}
        />

        <div className="thumbnail-overlay">
          <span className="duration-badge">
            {formatDuration(metadata.duration)}
          </span>

          <div className="hover-stats">
            <span className="stat-item">
              <span role="img" aria-label="views">👁️</span>
              {formatViews(metadata.views)}
            </span>
            <span className="stat-item">
              <span role="img" aria-label="calendar">📅</span>
              {new Date(metadata.uploadDate).getFullYear()}
            </span>
          </div>
        </div>
      </div>

      <div className="thumbnail-info">
        <h3 className="title" title={metadata.title}>
          {metadata.title}
        </h3>

        <div className="metadata-footer">
          <p className="uploader">{metadata.uploader}</p>

          {metadata.tags && (
            <div className="tags-container">
              {metadata.tags.slice(0, 2).map(tag => (
                <span key={tag} className="tag-pill">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

ThumbnailCard.propTypes = {
  metadata: PropTypes.shape({
    thumbnailFile: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    uploadDate: PropTypes.string.isRequired,
    uploader: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default ThumbnailCard;