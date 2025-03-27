// components/ThumbnailGrid/ThumbnailGrid.jsx
import PropTypes from 'prop-types';
import React from 'react';
import ThumbnailCard from '../ThumbnailCard/ThumbnailCard';
import './ThumbnailGrid.css';

const ThumbnailGrid = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="thumbnail-grid loading">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="thumbnail-skeleton"></div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="thumbnail-grid empty">
                <p>No thumbnails to display</p>
            </div>
        );
    }

    return (
        <div className="thumbnail-grid">
            {data.map((metadata) => (
                <ThumbnailCard
                    key={metadata.id}
                    metadata={metadata}
                />
            ))}
        </div>
    );
};

ThumbnailGrid.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            views: PropTypes.number.isRequired,
            duration: PropTypes.number.isRequired,
            uploadDate: PropTypes.string.isRequired,
            uploader: PropTypes.string.isRequired,
            thumbnailFile: PropTypes.string.isRequired,
            tags: PropTypes.arrayOf(PropTypes.string)
        })
    ),
    isLoading: PropTypes.bool
};

export default ThumbnailGrid;