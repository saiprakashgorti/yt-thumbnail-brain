// components/MetadataPanel/MetadataPanel.jsx
import PropTypes from 'prop-types';
import React from 'react';
import './MetadataPanel.css';

const MetadataPanel = ({ metadata }) => {
    if (!metadata) return <div className="metadata-panel empty">Select a thumbnail to view details</div>;

    return (
        <div className="metadata-panel">
            <div className="metadata-header">
                <h2 className="title">{metadata.title}</h2>
                <div className="quick-stats">
                    <span className="stat-item">
                        <span role="img" aria-label="views">👁️</span>
                        {new Intl.NumberFormat().format(metadata.views)}
                    </span>
                    <span className="stat-item">
                        <span role="img" aria-label="duration">⏳</span>
                        {formatDuration(metadata.duration)}
                    </span>
                </div>
            </div>

            <div className="metadata-grid">
                <div className="metadata-item">
                    <label className="metadata-label">Uploader</label>
                    <p className="metadata-value">{metadata.uploader}</p>
                </div>

                <div className="metadata-item">
                    <label className="metadata-label">Upload Date</label>
                    <p className="metadata-value">
                        {new Date(metadata.uploadDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                <div className="metadata-item full-width">
                    <label className="metadata-label">Description</label>
                    <p className="metadata-value description-text">
                        {metadata.description}
                    </p>
                </div>

                <div className="metadata-item">
                    <label className="metadata-label">Engagement</label>
                    <p className="metadata-value">
                        {Math.round(metadata.views / metadata.duration)} views/min
                    </p>
                </div>
            </div>

            {metadata.tags && metadata.tags.length > 0 && (
                <div className="tags-section">
                    <h3 className="tags-heading">Tags</h3>
                    <div className="tag-container">
                        {metadata.tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to format duration
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

MetadataPanel.propTypes = {
    metadata: PropTypes.shape({
        title: PropTypes.string,
        views: PropTypes.number,
        duration: PropTypes.number,
        uploadDate: PropTypes.string,
        uploader: PropTypes.string,
        description: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string)
    })
};

export default MetadataPanel;