// src/components/ForecastCard.jsx

import React from 'react';

function ForecastCard({ forecastItem }) {
    const { dt_txt, main: { temp }, weather: [{ description, icon }] } = forecastItem;

    const date = new Date(dt_txt);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <div className="forecast-card">
            <p className="forecast-date">{day}, {monthDay}</p>
            <p className="forecast-time">{time}</p>
            <img src={iconUrl} alt={description} className="forecast-icon" />
            <p className="forecast-temp">{Math.round(temp)}°C</p>
            <p className="forecast-description">{description.charAt(0).toUpperCase() + description.slice(1)}</p>
        </div>
    );
}

export default ForecastCard;