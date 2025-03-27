// src/App.jsx
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import './App.css';
import Survey from './components/Survey/Survey';
import ThumbnailGrid from './components/ThumbnailGrid/ThumbnailGrid';
import { StudyProvider } from './contexts/StudyContext';

const ThumbnailCard = ({ metadata }) => {
  return (
    <article className="thumbnail-card">
      <div className="thumbnail-image-container">
        <LazyLoadImage
          src={`/thumbnails/${metadata.thumbnailFile}`}
          alt={`Thumbnail for "${metadata.title}"`}
          effect="opacity"
          placeholder={
            <div className="image-placeholder" />
          }
          className="thumbnail-image"
          onError={(e) => {
            e.target.src = '/fallback-thumbnail.jpg';
          }}
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
        <h3 className="title">{metadata.title}</h3>
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((number, index) => (
        number === '...' ? (
          <span key={index} className="pagination-ellipsis">...</span>
        ) : (
          <button
            key={index}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        )
      ))}

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};


function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const thumbnailData = require('./assets/data/processed-metadata.json');

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = thumbnailData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(thumbnailData.length / itemsPerPage);

  return (
    <StudyProvider>
      <div className="app-container dark-theme">
        <header className="app-header">
          <h1 className="app-title">Thumbnail Study</h1>
        </header>

        <div className="pagination-controls">
          <div className="items-per-page">
            <label className="items-label">Items per page:</label>
            <select
              className="items-select"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[12, 24, 48, 96].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <ThumbnailGrid data={currentItems} />
        <Survey />
      </div>
    </StudyProvider>
  );
}

// Helper functions
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

export default App;