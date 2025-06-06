// src/components/WeatherDisplay.jsx

import React from 'react';
import { WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';

function WeatherDisplay({ weather }) {
    if (!weather) {
        return null;
    }

    const {
        name,
        main: { temp, humidity, pressure },
        weather: [{ description, icon }],
        wind: { speed },
        sys: { country },
    } = weather;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <div className="weather-display">
            <h2 className="weather-city">{name}, {country}</h2>
            <div className="current-weather-main">
                <div className="weather-icon-circle">
                    <img src={iconUrl} alt={description} className="weather-icon" />
                </div>
                <div className="temperature-group">
                    <p className="temperature">{Math.round(temp)}</p>
                    <span className="degree-symbol">°C</span>
                </div>
            </div>
            <p className="weather-description">{description.charAt(0).toUpperCase() + description.slice(1)}</p>

            <div className="weather-details">
                <div className="detail-item">
                    <WiHumidity className="detail-icon" />
                    <p className="detail-value">{humidity}%</p>
                    <p className="detail-label">Humidity</p>
                </div>
                <div className="detail-item">
                    <WiStrongWind className="detail-icon" />
                    <p className="detail-value">{speed} m/s</p>
                    <p className="detail-label">Wind</p>
                </div>
                <div className="detail-item">
                    <WiBarometer className="detail-icon" />
                    <p className="detail-value">{pressure} hPa</p>
                    <p className="detail-label">Pressure</p>
                </div>
            </div>
        </div>
    );
}

export default WeatherDisplay;