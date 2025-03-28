import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './ThumbnailCard.css';

const ThumbnailCard = ({ metadata, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(metadata);
    }
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
          afterLoad={() => setIsLoaded(true)}
          onError={handleImageError}
        />
        <div className="duration">
          {formatDuration(metadata.duration)}
        </div>
      </div>
      <div className="thumbnail-info">
        <div className="title" title={metadata.title}>{metadata.title}</div>
        <div className="thumbnail-meta">
          <span className="uploader">{metadata.uploader}</span>
          <span className="views-count">{formatViews(metadata.views)}</span>
        </div>
      </div>
    </article>
  );
};

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

ThumbnailCard.propTypes = {
  metadata: PropTypes.shape({
    thumbnailFile: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    uploadDate: PropTypes.string.isRequired,
    uploader: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default ThumbnailCard;