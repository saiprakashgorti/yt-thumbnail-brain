import React, { useState } from 'react';
import { useStudy } from '../../contexts/StudyContext';

const Survey = () => {
    const { currentThumbnail, addResponse, setCurrentThumbnail } = useStudy();
    const [answers, setAnswers] = useState({
        reason: '',
        elements: [],
        trustLevel: 3,
        additional: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addResponse({
            thumbnailId: currentThumbnail.id,
            answers
        });
        setCurrentThumbnail(null);
    };

    if (!currentThumbnail) return null;

    return (
        <div className="survey-modal">
            <div className="survey-content">
                <h3>Why did you click this thumbnail?</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Main reason for clicking:</label>
                        <select
                            value={answers.reason}
                            onChange={(e) => setAnswers({ ...answers, reason: e.target.value })}
                            required
                        >
                            <option value="">Select a reason</option>
                            <option value="curiosity">Curiosity about content</option>
                            <option value="colors">Color scheme</option>
                            <option value="text">Text overlay</option>
                            <option value="face">Facial expression</option>
                            <option value="views">High view count</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Elements that caught your eye:</label>
                        <div className="checkbox-group">
                            {['Title', 'Colors', 'Faces', 'Text', 'Branding'].map(el => (
                                <label key={el}>
                                    <input
                                        type="checkbox"
                                        checked={answers.elements.includes(el)}
                                        onChange={(e) => {
                                            const elements = e.target.checked
                                                ? [...answers.elements, el]
                                                : answers.elements.filter(item => item !== el);
                                            setAnswers({ ...answers, elements });
                                        }}
                                    />
                                    {el}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>How trustworthy does this thumbnail look? (1-5)</label>
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map(num => (
                                <label key={num}>
                                    <input
                                        type="radio"
                                        name="trust"
                                        value={num}
                                        checked={answers.trustLevel === num}
                                        onChange={() => setAnswers({ ...answers, trustLevel: num })}
                                    />
                                    {num}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Additional comments:</label>
                        <textarea
                            value={answers.additional}
                            onChange={(e) => setAnswers({ ...answers, additional: e.target.value })}
                        />
                    </div>

                    <button type="submit">Submit Response</button>
                </form>
            </div>
        </div>
    );
};

export default Survey;