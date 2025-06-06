// src/components/ForecastDisplay.jsx

import React from 'react';
import ForecastCard from './ForecastCard.jsx';

function ForecastDisplay({ forecast }) {
    console.log("ForecastDisplay: Component rendered.");
    console.log("ForecastDisplay: Received forecast prop:", forecast); // Log the incoming prop

    if (!forecast || forecast.length === 0) {
        console.log("ForecastDisplay: forecast prop is empty or null, returning null.");
        return null;
    }

    const dailyForecastsToDisplay = [];
    const uniqueDates = new Set();

    forecast.forEach((item, index) => { // Added index for easier debugging
        console.log(`ForecastDisplay: Processing item ${index}:`, item); // Log each item being processed

        // Ensure item has the necessary properties before processing
        if (item && item.dt && item.main && typeof item.main.temp !== 'undefined') {
            const date = new Date(item.dt * 1000); // OpenWeatherMap's 'dt' is Unix timestamp in seconds
            const dateString = date.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            });

            console.log(`ForecastDisplay: Item ${index} - DateString: ${dateString}, Temp: ${item.main.temp}`); // Log date and temp

            if (!uniqueDates.has(dateString)) {
                dailyForecastsToDisplay.push(item);
                uniqueDates.add(dateString);
                console.log(`ForecastDisplay: Added item ${index} for date ${dateString}. dailyForecastsToDisplay length: ${dailyForecastsToDisplay.length}`);

                if (dailyForecastsToDisplay.length >= 5) {
                    console.log("ForecastDisplay: Reached 5 days, stopping forecast processing.");
                    return; // Break out of forEach
                }
            } else {
                console.log(`ForecastDisplay: Item ${index} - Date ${dateString} already added.`);
            }
        } else {
            console.log(`ForecastDisplay: Item ${index} - SKIPPED due to missing properties:`, item); // Log skipped items
        }
    });

    console.log("ForecastDisplay: Final dailyForecastsToDisplay:", dailyForecastsToDisplay); // Log the final array

    if (dailyForecastsToDisplay.length === 0) {
        console.log("ForecastDisplay: dailyForecastsToDisplay is empty after filtering, returning null.");
        return null;
    }

    return (
        <div className="forecast-display">
            <h3 className="forecast-title">5-Day Forecast</h3>
            <div className="forecast-cards-container">
                {dailyForecastsToDisplay.map((item) => (
                    <ForecastCard key={item.dt} forecastItem={item} />
                ))}
            </div>
        </div>
    );
}

export default ForecastDisplay;
