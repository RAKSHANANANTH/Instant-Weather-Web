// src/components/ForecastDisplay.jsx

import React from 'react';
import ForecastCard from './ForecastCard.jsx';

function ForecastDisplay({ forecast }) {
    // If forecast is null, undefined, or empty, don't render anything
    if (!forecast || forecast.length === 0) {
        return null;
    }

    // This array will store one representative forecast item for each of the next 5 days.
    const dailyForecastsToDisplay = [];
    const uniqueDates = new Set(); // To keep track of dates we've already added

    forecast.forEach(item => {
        // Ensure item has the necessary properties before processing
        // OpenWeatherMap's 'dt' is a Unix timestamp in seconds, convert to milliseconds for Date object
        if (item && item.dt && item.main && typeof item.main.temp !== 'undefined') {
            const date = new Date(item.dt * 1000);
            // Get a simple date string (e.g., "6/5/2025") to identify unique days
            const dateString = date.toLocaleDateString('en-US');

            // Check if we haven't added a forecast for this date yet
            if (!uniqueDates.has(dateString)) {
                dailyForecastsToDisplay.push(item);
                uniqueDates.add(dateString);

                // If we have 5 days, we can stop processing to get the next 5 days
                if (dailyForecastsToDisplay.length >= 5) {
                    return; // Break out of forEach
                }
            }
        }
    });

    // If after filtering, there are no valid forecasts, return null
    if (dailyForecastsToDisplay.length === 0) {
        return null;
    }

    return (
        <div className="forecast-display">
            <h3 className="forecast-title">5-Day Forecast</h3>
            <div className="forecast-cards-container">
                {dailyForecastsToDisplay.map((item) => (
                    // The 'key' is crucial for React list rendering. 'item.dt' is a unique timestamp.
                    <ForecastCard key={item.dt} forecastItem={item} />
                ))}
            </div>
        </div>
    );
}

export default ForecastDisplay;