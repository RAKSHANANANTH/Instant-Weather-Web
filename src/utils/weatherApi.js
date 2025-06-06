// src/utils/weatherApi.js

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Accessing API key from .env
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetches current weather data for a given location (city name, zip code, etc.).
 * @param {string} location - The location entered by the user.
 * @returns {Promise<object>} - Current weather data.
 */
export const getCurrentWeather = async (location) => {
    try {
        let url;
        // Basic detection for zip code (numeric) or city
        if (!isNaN(location) && location.length === 5) { // Assuming US zip codes for simplicity
            url = `${BASE_URL}/weather?zip=${location},us&appid=${API_KEY}&units=metric`;
        } else if (location.includes(',')) { // Assuming GPS coordinates (lat,lon)
            const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lon)) {
                url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            } else {
                throw new Error("Invalid GPS coordinates format. Use 'latitude,longitude'.");
            }
        }
        else { // Assume city name or landmark
            url = `${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=metric`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Location not found. Please try a different name or zip code.');
            }
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching current weather:", error);
        throw error; // Re-throw to be caught by the calling component
    }
};

/**
 * Fetches 5-day / 3-hour forecast data for a given location.
 * OpenWeatherMap's 5-day forecast is actually 3-hour intervals, we'll process it.
 * @param {string} location - The location entered by the user.
 * @returns {Promise<object>} - 5-day forecast data.
 */
export const getFiveDayForecast = async (location) => {
    try {
        let url;
        if (!isNaN(location) && location.length === 5) {
            url = `${BASE_URL}/forecast?zip=${location},us&appid=${API_KEY}&units=metric`;
        } else if (location.includes(',')) {
            const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lon)) {
                url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            } else {
                throw new Error("Invalid GPS coordinates for forecast. Use 'latitude,longitude'.");
            }
        }
        else {
            url = `${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=metric`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Location not found for forecast. Please try a different name or zip code.');
            }
            throw new Error(`API error for forecast: ${response.statusText}`);
        }
        const data = await response.json();

        // Process 3-hour forecast into daily forecast (e.g., daily average/max temp)
        const dailyForecast = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    temp_max: -Infinity,
                    temp_min: Infinity,
                    weather: item.weather[0].description,
                    icon: item.weather[0].icon,
                    date: date,
                    rawItems: [] // Store raw items to calculate avg later if needed
                };
            }
            dailyForecast[date].temp_max = Math.max(dailyForecast[date].temp_max, item.main.temp_max);
            dailyForecast[date].temp_min = Math.min(dailyForecast[date].temp_min, item.main.temp_min);
            // You might want to update weather icon based on the most prominent weather for the day
            // For simplicity, we'll just take the first one for the day or decide on a better logic.
            dailyForecast[date].rawItems.push(item);
        });

        // Convert the object to an array and limit to 5 days, skipping today
        const forecastArray = Object.values(dailyForecast)
            .filter((_, index) => index > 0) // Skip today's forecast
            .slice(0, 5); // Take next 5 days

        return forecastArray;
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
        throw error;
    }
};

/**
 * Fetches current weather based on GPS coordinates.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<object>} - Current weather data.
 */
export const getCurrentWeatherByCoords = async (lat, lon) => {
    try {
        const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather by coordinates:", error);
        throw error;
    }
};

/**
 * Fetches 5-day forecast based on GPS coordinates.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<object>} - 5-day forecast data.
 */
export const getFiveDayForecastByCoords = async (lat, lon) => {
    try {
        const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error for forecast by coords: ${response.statusText}`);
        }
        const data = await response.json();

        const dailyForecast = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    temp_max: -Infinity,
                    temp_min: Infinity,
                    weather: item.weather[0].description,
                    icon: item.weather[0].icon,
                    date: date,
                    rawItems: []
                };
            }
            dailyForecast[date].temp_max = Math.max(dailyForecast[date].temp_max, item.main.temp_max);
            dailyForecast[date].temp_min = Math.min(dailyForecast[date].temp_min, item.main.temp_min);
            dailyForecast[date].rawItems.push(item);
        });

        const forecastArray = Object.values(dailyForecast)
            .filter((_, index) => index > 0)
            .slice(0, 5);

        return forecastArray;
    } catch (error) {
        console.error("Error fetching 5-day forecast by coordinates:", error);
        throw error;
    }
};