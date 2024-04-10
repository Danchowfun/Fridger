// Advertisements.js
import React, { useState, useEffect } from 'react';

function Advertisements() {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        // Placeholder for fetching ads from backend
        setAds(['Ad for Local Organic Market', 'Discount Coupon for Next Purchase']);
    }, []);

    return (
        <div className="advertisements">
            <h2>Advertisements</h2>
            <ul>
                {ads.map((ad, index) => (
                    <li key={index}>{ad}</li>
                ))}
            </ul>
        </div>
    );
}

export default Advertisements;
