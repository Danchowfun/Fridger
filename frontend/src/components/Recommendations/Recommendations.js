// Recommendations.js
import React, { useState, useEffect } from 'react';

function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // Placeholder for fetching recommendations from backend
        setRecommendations(['Store A - 5 km away', 'Store B - Best for fresh produce']);
    }, []);

    return (
        <div className="recommendations">
            <h2>Store Recommendations</h2>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );
}

export default Recommendations;
