// src/utils/weatherApi.js

// Access the API key from the environment variables
// Ensure VITE_OPENWEATHER_API_KEY is defined in your .env file in the project root
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function to handle API responses and errors
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json();
        // Construct a more descriptive error message
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

/**
 * Fetches current weather data for a given city or query.
 * @param {string} query - City name, zip code, or city ID.
 * @returns {Object} - Current weather data.
 */
export async function getCurrentWeather(query) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${query}&appid=${API_KEY}&units=metric`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching current weather:", error);
        throw new Error(`Failed to get current weather for ${query}: ${error.message}`);
    }
}

/**
 * Fetches 5-day / 3-hour forecast data for a given city or query.
 * @param {string} query - City name, zip code, or city ID.
 * @returns {Object} - 5-day forecast data (includes a 'list' array of 3-hour forecasts).
 */
export async function getFiveDayForecast(query) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${query}&appid=${API_KEY}&units=metric`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
        throw new Error(`Failed to get 5-day forecast for ${query}: ${error.message}`);
    }
}

/**
 * Fetches current weather data for given coordinates.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Object} - Current weather data.
 */
export async function getCurrentWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching current weather by coordinates:", error);
        throw new Error(`Failed to get current weather for coordinates: ${error.message}`);
    }
}

/**
 * Fetches 5-day / 3-hour forecast data for given coordinates.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Object} - 5-day forecast data (includes a 'list' array of 3-hour forecasts).
 */
export async function getFiveDayForecastByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching 5-day forecast by coordinates:", error);
        throw new Error(`Failed to get 5-day forecast for coordinates: ${error.message}`);
    }
}
